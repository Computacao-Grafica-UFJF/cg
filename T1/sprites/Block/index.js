import * as THREE from "three";

class Block extends THREE.Mesh {
    constructor(x, y, z, width, height) {
        const blockGeometry = new THREE.BoxGeometry(1, height, width).rotateY(Math.PI / 2);
        const blockMaterial = new THREE.MeshPhongMaterial({ color: "rgb(255, 255, 255)", shininess: 1 });

        super(blockGeometry, blockMaterial);

        console.log(this.geometry.parameters.width);

        this.translateX(x);
        this.translateY(y);
        this.translateZ(z);
    }
}

export default Block;
