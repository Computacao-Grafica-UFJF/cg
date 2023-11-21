import * as THREE from "three";

class Plane extends THREE.Mesh {
    constructor(width, height) {
        const planeGeometry = new THREE.PlaneGeometry(width, height, 80, 80);
        const planeMaterial = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide, transparent: true, opacity: 0 });
        super(planeGeometry, planeMaterial);

        this.receiveShadow = true;
        this.position.set(0, 0, -0.4);
    }
}

export default Plane;
