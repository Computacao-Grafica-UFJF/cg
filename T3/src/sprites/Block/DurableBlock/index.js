import * as THREE from "three";
import Block from "../index.js";

class DurableBlock extends Block {
    constructor(x, y, z, width, height) {
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load("./assets/texture/blocks/texture_block.jpg");

        super(x, y, z, width, height, 1.4, "#E8EEF2", texture);

        this.maxHits = 2;
        this.hits = 0;
    }

    hit() {
        this.hits++;

        if (this.hits === this.maxHits) {
            return true;
        }

        const newMaterial = new THREE.MeshLambertMaterial({ color: this.getColor() });
        this.material = newMaterial;

        return false;
    }

    getColor() {
        const colors = ["#E8EEF2", "#555"];

        return colors[this.hits];
    }
}

export default DurableBlock;
