import * as THREE from "three";

export class MiniBall extends THREE.Mesh {
    constructor(radius, widthSegments, number, color, shininess) {
        const geometry = new THREE.SphereGeometry(radius, widthSegments, number);
        const material = new THREE.MeshPhongMaterial({ color, shininess });

        super(geometry, material);
    }
}

export default MiniBall;
