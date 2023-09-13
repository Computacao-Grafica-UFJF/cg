import Block from "../../sprites/Block/index.js";

class BlocksBuilder {
    static horizontalSpace = 0.1;
    static verticalSpace = 0.1;

    static levelWidth = 14.0;
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

        const leftMargin = -7 + blockWidth / 2;

        const blocks = [];

        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j]) {
                    const x = this.getXPosition(j, blockWidth, leftMargin);
                    const y = this.getYPosition(i, this.blockHeight);
                    const z = 0;

                    const block = new Block(x, y, z, blockWidth, this.blockHeight);

                    blocks.push(block);
                }
            }
        }

        return blocks;
    }
}

export default BlocksBuilder;
