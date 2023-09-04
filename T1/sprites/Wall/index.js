import * as THREE from "three";

class Wall extends THREE.Mesh {
    constructor(x, y, z, width, height) {
        const cylinderGeometry = new THREE.BoxGeometry(width, height);

        const cylinderMaterial = new THREE.MeshBasicMaterial({ color: "rgb(0, 0, 0)" });

        super(cylinderGeometry, cylinderMaterial);

        this.translateX(x);
        this.translateY(y);
        this.translateZ(z);
    }
}

export default Wall;
