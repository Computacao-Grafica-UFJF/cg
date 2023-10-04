import * as THREE from "three";

class PerspectiveCameraWrapper extends THREE.PerspectiveCamera {
    constructor() {
        super();

        const fov = 75;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 0.1;
        const far = 1000;

        const position = new THREE.Vector3(0, 0, 22);
        const lookAt = new THREE.Vector3(0, 0, 0);

        this.position.copy(position);
        this.lookAt(lookAt);

        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;

        this.updateProjectionMatrix();
    }
}

export default PerspectiveCameraWrapper;
