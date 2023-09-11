import * as THREE from "three";

class Hitter extends THREE.Mesh {
    constructor(x, y, z) {
        const boxGeometry = new THREE.BoxGeometry(4, 0.5, 1);
        const boxMaterial = new THREE.MeshPhongMaterial({ color: "rgb(255,255,255)" });

        super(boxGeometry, boxMaterial);

        this.translateX(x);
        this.translateY(y);
        this.translateZ(z);
    }

    moveX = (x) => {
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

    getReflexiveKickBallAngle = (relativeX, angle) => {
        return this.getDirectlyKickBallAngle(relativeX);
    };

    getKickBallAngle(relativeX, angle) {
        return this.getDirectlyKickBallAngle(relativeX);
    }
}

export default Hitter;
