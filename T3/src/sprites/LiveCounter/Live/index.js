import * as THREE from "three";

class Live extends THREE.Mesh {
    constructor(x, y, z) {
        const geometry = new THREE.SphereGeometry(0.3, 32, 32);
        const material = new THREE.MeshPhongMaterial({ color: "red", shininess: 1000 });

        super(geometry, material);

        this.receiveShadow = true;
        this.castShadow = true;

        this.translateX(x);
        this.translateY(y);
        this.translateZ(z);
    }
}

export default Live;
