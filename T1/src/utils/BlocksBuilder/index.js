import DurableBlock from "../../sprites/Block/DurableBlock/index.js";
import Block from "../../sprites/Block/index.js";

class BlocksBuilder {
    static horizontalSpace = 0.1;
    static verticalSpace = 0.1;

    static levelWidth = 15.0;
    static blockHeight = 0.5;
    static topMargin = 12;

    static getXPosition = (index, blockWidth, leftMargin) => {
        return index * (blockWidth + this.horizontalSpace) + leftMargin;
    };

    static getYPosition = (index, blockHeight) => {
        return -index * (blockHeight + this.verticalSpace) + this.topMargin;
    };

    static buildGamePlatform(matrix) {
        const blockWidth = (this.levelWidth - (matrix[0].length - 1) * this.horizontalSpace) / matrix[0].length;

        const leftMargin = -7.5 + blockWidth / 2;

        const blocks = matrix.flatMap((row, i) =>
            row.map((cell, j) => (cell ? this.createBlock(j, i, cell, blockWidth, leftMargin) : null)).filter((block) => block !== null)
        );

        return blocks;
    }

    static createBlock(j, i, cell, blockWidth, leftMargin) {
        const x = this.getXPosition(j, blockWidth, leftMargin);
        const y = this.getYPosition(i, this.blockHeight);
        const z = 0;

        if (cell === 7) {
            return new DurableBlock(x, y, z, blockWidth, this.blockHeight, this.getBlockColor(cell));
        }

        return new Block(x, y, z, blockWidth, this.blockHeight, this.getBlockColor(cell));
    }

    static getBlockColor = (i) => {
        if (i === 1) {
            return "#8BEE36";
        }

        if (i === 2) {
            return "#E63559";
        }

        if (i === 3) {
            return "#E68536";
        }

        if (i === 4) {
            return "#E6CB36";
        }

        if (i === 5) {
            return "#338AF4";
        }

        if (i === 6) {
            return "#C635EF";
        }
    };
}

export default BlocksBuilder;
