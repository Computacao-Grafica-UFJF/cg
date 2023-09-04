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
}

export default Hitter;
