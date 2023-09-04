import * as THREE from "three";

export class MiniBall extends THREE.Mesh {
    constructor(x, y, z) {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshPhongMaterial({ color: "#fff", shininess: 200 });

        super(geometry, material);

        this.translateX(x);
        this.translateY(y);
        this.translateZ(z);

        this.speedX = 0.1;
        this.angle = -Math.PI / 2;

        this.rotateX(this.angle);
    }

    update() {
        this.translateX(this.speedX);
        this.rotation.set(0, 0, this.angle);
    }
}
export default MiniBall;
