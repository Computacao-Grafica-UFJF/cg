import * as THREE from "three";

class Block extends THREE.Mesh {
    constructor(x, y, z, width, height, color) {
        const blockGeometry = new THREE.BoxGeometry(1, height, width).rotateY(Math.PI / 2);
        const blockMaterial = new THREE.MeshLambertMaterial({ color: color });

        super(blockGeometry, blockMaterial);

        this.translateX(x);
        this.translateY(y);
        this.translateZ(z);
    }
}

export default Block;
