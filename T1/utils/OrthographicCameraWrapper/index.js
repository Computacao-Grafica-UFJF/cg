import * as THREE from "three";

class OrthographicCameraWrapper extends THREE.OrthographicCamera {
    constructor() {
        const aspect = window.innerWidth / window.innerHeight;
        const width = 65;
        const height = width / aspect;

        super(width / -2, width / 2, height / 2, height / -2, -1000, 1000);

        this.position.set(0, 0, 0);
    }
}

export default OrthographicCameraWrapper;
