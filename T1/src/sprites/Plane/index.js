import * as THREE from "three";

class Plane extends THREE.Mesh {
    constructor() {
        const planeGeometry = new THREE.PlaneGeometry(15, 30, 80, 80);
        const planeMaterial = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide, color: "#47454E" });
        super(planeGeometry, planeMaterial);

        this.receiveShadow = true;
        this.position.set(0, 0, -0.4);
    }
}

export default Plane;
