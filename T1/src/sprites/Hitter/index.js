import * as THREE from "three";
import AngleHandler from "../../utils/AngleHandler/index.js";
import Game from "../../lib/Game/index.js";
import HitterBuilder from "../../utils/HitterBuilder/index.js";

class Hitter extends THREE.Mesh {
    paused = false;

    constructor(x, y, z, color) {
        const radius = 2;
        const height = radius / 4;

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

    getAngleOffsetBySegment(segment) {
        const angleOffsets = [120, 105, 90, 75, 60];
        return angleOffsets[segment];
    }

    getKickBallAngle = (relativeX, angle) => {
        if (angle > 0 && angle < Math.PI) return angle;

        const invertedAngle = angle - Math.PI;
        const segment = this.getSegmentPositionByRelativeX(relativeX);
        const angleOffset = THREE.MathUtils.degToRad(this.getAngleOffsetBySegment(segment));

        const returnAngle = AngleHandler.invertAngleAboutNormal(invertedAngle, angleOffset);

        return AngleHandler.limitAngle(returnAngle);
    };

    resetPosition() {
        this.position.set(0, -13, 0);
    }
}

export default Hitter;
