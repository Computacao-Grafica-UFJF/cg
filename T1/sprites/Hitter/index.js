import * as THREE from "three";

class Hitter extends THREE.Mesh {
    constructor(x, y, z) {
        const cylinderGeometry = new THREE.BoxGeometry(4, 1, 1);
        const cylinderMaterial = new THREE.MeshPhongMaterial({ color: "rgb(255, 0, 0)", shininess: 1000 });

        super(cylinderGeometry, cylinderMaterial);

        this.translateX(x);
        this.translateY(y);
        this.translateZ(z);
    }

    dance = () => {
        this.translateX(2);
    };

    moveX = (x) => {
        this.position.x = x;
    };
}

export default Hitter;
