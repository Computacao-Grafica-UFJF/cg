import * as THREE from "three";

export class Platform extends THREE.Mesh {
    constructor(width, height, color) {
        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshLambertMaterial({ color: color });

        super(geometry, material);
    }
}

export default Platform;
