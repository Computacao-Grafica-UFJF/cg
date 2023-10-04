import * as THREE from "three";

export class Platform extends THREE.Mesh {
    constructor(width, height, color) {
        const geometry = new THREE.PlaneGeometry(width, height, 1, 1);
        const material = new THREE.MeshLambertMaterial({ color: color });

        super(geometry, material);

        this.position.set(0, 0, -0.5);
    }
}

export default Platform;
