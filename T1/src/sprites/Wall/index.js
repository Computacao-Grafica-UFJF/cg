import * as THREE from "three";

class Wall extends THREE.Mesh {
    constructor(x, y, z, width, height, type) {
        const boxGeometry = new THREE.BoxGeometry(width, height);

        const boxMaterial = new THREE.MeshLambertMaterial({ color: "#47454E", shadowSide: THREE.DoubleSide });

        super(boxGeometry, boxMaterial);

        this.translateX(x);
        this.translateY(y);
        this.translateZ(z);

        this.type = type;
        this.castShadow = true;
    }
}

export default Wall;
