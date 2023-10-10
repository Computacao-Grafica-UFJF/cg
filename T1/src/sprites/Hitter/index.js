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

    getSegmentPositionByRelativeX(relativeX) {
        if (relativeX <= -this.width / 2) return 0;
        if (relativeX >= this.width / 2) return 4;

        const segmentWidth = this.width / 5;
        const absoluteX = relativeX + this.width / 2;

        const segment = Math.floor(absoluteX / segmentWidth);
        return segment;
    }

    // getAngleOffsetBySegment(segment) {
    //     const angleOffsets = [120, 105, 90, 75, 60];
    //     return angleOffsets[segment];
    // }

    // getKickBallAngle = (relativeX, angle) => {
    //     if (angle > 0 && angle < Math.PI) return angle;

    //     const invertedAngle = angle - Math.PI;
    //     const segment = this.getSegmentPositionByRelativeX(relativeX);
    //     const angleOffset = THREE.MathUtils.degToRad(this.getAngleOffsetBySegment(segment));

    //     const returnAngle = AngleHandler.invertAngleAboutNormal(invertedAngle, angleOffset);

    //     return AngleHandler.limitAngle(returnAngle);
    // };

    getKickBallAngle = (angleNormal, angle) => {
        if (angle > 0 && angle < Math.PI) return angle;

        const invertedAngle = angle - Math.PI;

        const returnAngle = AngleHandler.invertAngleAboutNormal(invertedAngle, angleNormal);

        return AngleHandler.limitAngle(returnAngle);
    };

    getIndexOfPointOfIntersection(positionCollisionBall) {
        const vertexPositions = this.geometry.attributes.position.array;
        let collisionIndex = -1,
            minDistance = Infinity;

        for (let i = 0; i < vertexPositions.length; i += 3) {
            const axisDisplacement = -13;

            const xOfVertex = vertexPositions[i];
            const distanceRelative = Math.abs(xOfVertex - positionCollisionBall.x);

            if (distanceRelative < minDistance) {
                minDistance = distanceRelative;
                collisionIndex = i / 3;

                console.log("entrou: ", minDistance);
            }
        }

        console.log(minDistance, collisionIndex); //990

        return collisionIndex;
    }

    getNormalOfPointIntersect = (positionCollisionBallWithHitter) => {
        const collisionPointIndex = this.getIndexOfPointOfIntersection(positionCollisionBallWithHitter);

        console.log("Ponto de intersecção: ", this.geometry.attributes.position.array[collisionPointIndex]);

        const vertexNormals = this.geometry.attributes.normal.array;

        const normal = new THREE.Vector3( // Normal correspondente ao ponto de colisão
            vertexNormals[collisionPointIndex * 3],
            vertexNormals[collisionPointIndex * 3 + 1],
            vertexNormals[collisionPointIndex * 3 + 2]
        );

        normal.applyMatrix4(this.matrixWorld);

        // console.log("normal:", normal);

        return normal;
    };

    resetPosition() {
        this.position.set(0, -13, 0);
    }
}

export default Hitter;
