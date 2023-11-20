import * as THREE from "three";

export class AuxiliarPlatform extends THREE.Mesh {
    constructor(width, height) {
        const geometry = new THREE.PlaneGeometry(width, height, 1, 1);
        const material = new THREE.MeshLambertMaterial({ transparent: true, opacity: 0 });

        super(geometry, material);

        this.position.set(0, 0, 0);
    }
}

export default AuxiliarPlatform;
