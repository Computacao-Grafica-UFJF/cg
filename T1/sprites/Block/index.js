import * as THREE from "three";

class Block extends THREE.Mesh {
    constructor(x, y, z) {
        const sphereGeometry = new THREE.BoxGeometry(1, 1, 1).rotateY(Math.PI / 2);
        const sphereMaterial = new THREE.MeshPhongMaterial({ color: "rgb(255, 255, 255)", shininess: 1 });

        super(sphereGeometry, sphereMaterial);

        this.translateX(x);
        this.translateY(y);
        this.translateZ(z);
    }

    dance = () => {
        this.translateX(5);
    };
}

export default Block;
