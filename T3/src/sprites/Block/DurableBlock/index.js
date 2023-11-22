import * as THREE from "three";
import Block from "../index.js";

class DurableBlock extends Block {
    constructor(x, y, z, width, height, type) {
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load("./assets/texture/blocks/texture_block.jpg");

        super(x, y, z, width, height, 1.4, "#fff", type, texture);

        this.maxHits = 2;
        this.hits = 0;
    }

    hit() {
        this.hits++;

        if (this.hits === this.maxHits) {
            return true;
        }

        const newMaterial = new THREE.MeshLambertMaterial({ color: "#555" });
        this.material = newMaterial;

        return false;
    }
}

export default DurableBlock;
