import * as THREE from "three";

class PerspectiveCameraWrapper extends THREE.PerspectiveCamera {
    constructor() {
        super();

        const fov = 43.3;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 0.1;
        const far = 1000;

        const position = new THREE.Vector3(0, -17, 30);
        const lookAt = new THREE.Vector3(0, -2, 0);

        this.position.copy(position);
        this.lookAt(lookAt);

        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;

        this.updateProjectionMatrix();
    }

    resetToStartingPosition() {
        const fov = 43.3;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 0.1;
        const far = 1000;

        const position = new THREE.Vector3(0, -17, 30);
        const lookAt = new THREE.Vector3(0, -2, 0);

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
