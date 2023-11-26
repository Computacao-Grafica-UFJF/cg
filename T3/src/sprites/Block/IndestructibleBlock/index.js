import Block from "../index.js";

class IndestructibleBlock extends Block {
    constructor(x, y, z, width, height) {
        super(x, y, z, width, height, 1.4, "#f2c22d", "indestructible");
    }

    hit() {
        return false;
    }
}

export default IndestructibleBlock;
