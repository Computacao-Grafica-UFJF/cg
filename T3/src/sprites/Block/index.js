import * as THREE from "three";

class Block extends THREE.Mesh {
    constructor(x, y, z, width, height, length, color, texture) {
        const blockGeometry = new THREE.BoxGeometry(length, height, width).rotateY(Math.PI / 2);
        const blockMaterial = new THREE.MeshLambertMaterial({ color: color });

        if (texture) {
            blockMaterial.map = texture;
        }

        super(blockGeometry, blockMaterial);

        this.castShadow = true;

        this.shadowColor = new THREE.Color("red");

        this.translateX(x);
        this.translateY(y);
        this.translateZ(z);
    }

    hit() {
        return true;
    }

    destructor() {
        this.geometry.dispose();
        this.material.dispose();
    }
}

export default Block;
