import * as THREE from "three";

class Hitter extends THREE.Mesh {
    constructor(x, y, z) {
        const cylinderGeometry = new THREE.BoxGeometry(4, 1, 1);
        const cylinderMaterial = new THREE.MeshPhongMaterial({ color: "rgb(255,255,255)" });

        super(cylinderGeometry, cylinderMaterial);

        this.translateX(x);
        this.translateY(y);
        this.translateZ(z);
    }

    moveX = (x) => {
        this.position.x = x;
    };

    getKickBallAngle(relativeX) {
        const inputMax = -2.5;
        const inputMin = 2.5;

        const outputMin = 10;
        const outputMax = 170;

        const outputValue = ((relativeX - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin) + outputMin;

        return THREE.MathUtils.degToRad(Math.min(Math.max(outputValue, outputMin), outputMax));
    }
}

export default Hitter;
