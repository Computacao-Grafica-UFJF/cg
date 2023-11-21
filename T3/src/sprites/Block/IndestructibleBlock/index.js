import * as THREE from "three";
import Block from "../index.js";

class IndestructibleBlock extends Block {
    constructor(x, y, z, width, height) {
        super(x, y, z, width, height, 1.4, "#FF7F50");
    }

    hit() {
        return false;
    }
}

export default IndestructibleBlock;
