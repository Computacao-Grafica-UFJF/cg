import DurableBlock from "../../sprites/Block/DurableBlock/index.js";
import IndestructibleBlock from "../../sprites/Block/IndestructibleBlock/index.js";
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

        if (cell === 6) {
            return new DurableBlock(x, y, z, blockWidth, this.blockHeight, "durableBlock");
        }

        if (cell === 7) {
            return new IndestructibleBlock(x, y, z, blockWidth, this.blockHeight, "indestructibleBlock");
        }

        return new Block(x, y, z, blockWidth, this.blockHeight, 1, this.getBlockColor(cell), "normalBlock");
    }

    static getBlockColor = (i) => {
        const indexColors = {
            1: "#6BCE16",
            2: "#C61539",
            3: "#Df8536",
            4: "#136AC4",
            5: "#cf867e",
        };

        if (!indexColors[i]) console.error(`Color for block with index ${i} not found`);

        return indexColors[i];
    };
}

export default BlocksBuilder;
