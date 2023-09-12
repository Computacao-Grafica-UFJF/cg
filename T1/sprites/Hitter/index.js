import * as THREE from "three";

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

    getDirectlyKickBallAngle = (relativeX) => {
        const inputMax = -2.5;
        const inputMin = 2.5;

        const outputMin = 10;
        const outputMax = 170;

        const outputValue = ((relativeX - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin) + outputMin;

        return THREE.MathUtils.degToRad(Math.min(Math.max(outputValue, outputMin), outputMax));
    };

    getReflexiveKickBallAngle = (relativeX) => {
        return this.getDirectlyKickBallAngle(relativeX);
    };

    getKickBallAngle(relativeX) {
        return this.getDirectlyKickBallAngle(relativeX);
    }

    pause() {
        this.paused = !this.paused;
    }

    resetPosition() {
        this.position.set(0, -13, 0);
    }
}

export default Hitter;
