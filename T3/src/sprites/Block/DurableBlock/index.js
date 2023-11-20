import Block from "../index.js";

class DurableBlock extends Block {
    constructor(x, y, z, width, height) {
        super(x, y, z, width, height, 1.4, "#E8EEF2");

        this.maxHits = 2;
        this.hits = 0;
    }

    hit() {
        this.hits++;

        if (this.hits === this.maxHits) {
            return true;
        }

        this.material.color.set(this.getColor());
        return false;
    }

    getColor() {
        const colors = ["#E8EEF2", "#555"];

        return colors[this.hits];
    }
}

export default DurableBlock;
