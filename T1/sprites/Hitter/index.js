import * as THREE from "three";
import AngleHandler from "../../utils/AngleHandler/index.js";

class Hitter extends THREE.Mesh {
    paused = false;

    constructor(x, y, z, color) {
        const boxGeometry = new THREE.BoxGeometry(4, 0.5, 1);
        const boxMaterial = new THREE.MeshLambertMaterial({ color: color });

        super(boxGeometry, boxMaterial);

        this.translateX(x);
        this.translateY(y);
        this.translateZ(z);
    }

    moveX = (x) => {
        if (this.paused) {
            return;
        }

        this.position.x = x;
    };

    getSegmentPositionByRelativeX(relativeX) {
        const width = this.geometry.parameters.width;
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

        // console.log({
        //     chegouEm: THREE.MathUtils.radToDeg(angle),
        //     inverteu: THREE.MathUtils.radToDeg(invertedAngle),
        //     normal: THREE.MathUtils.radToDeg(angleOffset),
        //     return: THREE.MathUtils.radToDeg(returnAngle),
        //     relativeX: relativeX,
        // });

        return AngleHandler.limitAngle(returnAngle);
    };

    pause() {
        this.paused = !this.paused;
    }

    resetPosition() {
        this.position.set(0, -13, 0);
    }
}

export default Hitter;
