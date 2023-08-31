import * as THREE from "three";

export class MiniBall extends THREE.Mesh {
    constructor(x, y, z) {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshPhongMaterial({ color: "rgb(255, 0, 0)", shininess: 200 });

        super(geometry, material);

        this.translateX(x);
        this.translateY(y);
        this.translateZ(z);
    }
}

export default MiniBall;
