import Block from "../index.js";

class DurableBlock extends Block {
    constructor(x, y, z, width, height) {
        super(x, y, z, width, height, 1.4, "#E8EEF2");
    }

    hit() {
        this.material.color.set("#424546");
    }
}

export default DurableBlock;
