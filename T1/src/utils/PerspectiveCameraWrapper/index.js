import * as THREE from "three";

class PerspectiveCameraWrapper extends THREE.PerspectiveCamera {
    constructor() {
        const fov = 75;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 0.1;
        const far = 1000;

        super(fov, aspect, near, far);

        this.position.set(25, 0, 0);
    }
}

export default PerspectiveCameraWrapper;
