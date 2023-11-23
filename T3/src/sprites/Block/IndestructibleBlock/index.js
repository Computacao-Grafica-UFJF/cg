import Block from "../index.js";

class IndestructibleBlock extends Block {
    constructor(x, y, z, width, height, type) {
        super(x, y, z, width, height, 1.4, "#f2c22d", type);
    }

    hit() {
        return false;
    }
}

export default IndestructibleBlock;
