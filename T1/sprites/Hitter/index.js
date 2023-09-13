import * as THREE from "three";
import AngleHandler from "../../utils/AngleHandler/index.js";

class Hitter extends THREE.Mesh {
    paused = true;

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
        const degreeAngle = AngleHandler.invertAngleVertically(angle);
        const segment = this.getSegmentPositionByRelativeX(relativeX);
        const angleOffset = THREE.MathUtils.degToRad(this.getAngleOffsetBySegment(segment));

        const returnAngle = AngleHandler.invertAngleAboutNormal(degreeAngle, angleOffset);

        console.log({
            angle: THREE.MathUtils.radToDeg(angle),
            degreeAngle: THREE.MathUtils.radToDeg(degreeAngle),
            angleOffset: THREE.MathUtils.radToDeg(angleOffset),
            returnAngle: THREE.MathUtils.radToDeg(returnAngle),
        });

        return THREE.MathUtils.degToRad(returnAngle);
    };

    pause() {
        this.paused = !this.paused;
    }

    resetPosition() {
        this.position.set(0, -13, 0);
    }
}

export default Hitter;
