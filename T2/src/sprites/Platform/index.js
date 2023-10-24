import * as THREE from "three";

export class Platform extends THREE.Mesh {
    constructor(width, height, color, receiveShadow, castShadow) {
        const geometry = new THREE.PlaneGeometry(width, height, 1, 1);
        const material = new THREE.MeshLambertMaterial({ color: color });

        material.side = THREE.DoubleSide;

        super(geometry, material);

        this.receiveShadow = receiveShadow;
        this.castShadow = castShadow;
        this.position.set(0, 0, -0.5);
    }
}

export default Platform;
