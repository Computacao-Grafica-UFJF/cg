import * as THREE from "three";
import AngleHandler from "../../utils/AngleHandler/index.js";
import Game from "../../lib/Game/index.js";

class Hitter extends THREE.Mesh {
    paused = false;

    constructor(x, y, z, color) {
        const boxGeometry = new THREE.BoxGeometry(4, 0.5, 2);
        const boxMaterial = new THREE.MeshLambertMaterial({ color: color });

        super(boxGeometry, boxMaterial);

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
        const width = this.geometry.parameters.width;

        if (relativeX <= -width / 2) return 0;
        if (relativeX >= width / 2) return 4;

        const segmentWidth = width / 5;
        const absoluteX = relativeX + width / 2;

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
