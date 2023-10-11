import * as THREE from "three";
import AngleHandler from "../../utils/AngleHandler/index.js";
import Game from "../../lib/Game/index.js";
import HitterBuilder from "../../utils/HitterBuilder/index.js";

class Hitter extends THREE.Mesh {
    paused = false;

    constructor(x, y, z, color) {
        const radius = 2;
        const height = radius / 2;

        const mesh = HitterBuilder.buildObjects(radius, height);
        const material = new THREE.MeshLambertMaterial({ color });

        super(mesh.geometry, material);

        this.radius = radius;
        this.height = height;
        this.width = 2 * radius;

        this.geometry.scale(1, 1, 0.5);

        this.rotateX(THREE.MathUtils.degToRad(270));

        this.receiveShadow = true;
        this.castShadow = true;

        this.translateX(x);
        this.translateY(y);
        this.translateZ(z);
    }

    moveX = (x) => {
        if (Game.paused) {
            return;
        }

        this.position.x = x;
    };

    getIndexVertexCollision = (point) => {
        const vertexPositions = this.geometry.attributes.position.array;
        let collisionIndex = -1,
            minDistance = Infinity;

        // console.log("p", point);

        for (let i = 0; i < vertexPositions.length - 499; i += 3) {
            const vertex = new THREE.Vector3(vertexPositions[i], vertexPositions[i + 1] - 13, vertexPositions[i + 2]);
            const distance = point.distanceTo(vertex);

            if (distance < minDistance) {
                minDistance = distance;
                collisionIndex = i / 3;

                // console.log("entrou: ", vertex, " ", minDistance, " ", collisionIndex);
            }
        }

        return collisionIndex;
    };

    getNormalCollision = (point) => {
        const indexVertexHitterColision = this.getIndexVertexCollision(point);

        const vertexNormals = this.geometry.attributes.normal.array;

        const normal = new THREE.Vector3( // Normal correspondente ao ponto de colisão
            vertexNormals[indexVertexHitterColision * 3],
            vertexNormals[indexVertexHitterColision * 3 + 1],
            vertexNormals[indexVertexHitterColision * 3 + 2]
        );

        normal.applyMatrix4(this.matrixWorld);

        // console.log("normal:", normal);

        return normal;
    };

    getSegmentPositionByRelativeX(relativeX) {
        if (relativeX <= -this.width / 2) return 0;
        if (relativeX >= this.width / 2) return 4;

        const segmentWidth = this.width / 5;
        const absoluteX = relativeX + this.width / 2;

        const segment = Math.floor(absoluteX / segmentWidth);
        return segment;
    }

    getAngleOffsetBySegment(segment) {
        const angleOffsets = [120, 105, 90, 75, 60];
        return angleOffsets[segment];
    }

    getKickBallAngle = (normalAngle, angle) => {
        if (angle > 0 && angle < Math.PI) return angle;

        const invertedAngle = angle - Math.PI;
        // const segment = this.getSegmentPositionByRelativeX(relativeX);
        // const angleOffset = THREE.MathUtils.degToRad(this.getAngleOffsetBySegment(segment));

        const returnAngle = AngleHandler.invertAngleAboutNormal(invertedAngle, normalAngle);

        return AngleHandler.limitAngle(returnAngle);
    };

    reflectionLaw = (normal, incident) => {
        // Certifique-se de que os vetores são normalizados
        normal.normalize();
        incident.normalize();

        // Calcula o componente da incidência na direção da normal
        const incidentComponent = normal.clone().multiplyScalar(incident.dot(normal));

        // Calcula o vetor refletido
        const reflection = new THREE.Vector3().copy(incident).sub(incidentComponent.multiplyScalar(2));

        return reflection;
    };

    resetPosition() {
        this.position.set(0, -13, 0);
    }
}

export default Hitter;
