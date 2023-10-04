import BlocksBuilder from "../../utils/BlocksBuilder/index.js";

import Level from "../../lib/Level/index.js";
import Game from "../../lib/Game/index.js";

class Level1 extends Level {
    constructor() {
        super();

        this.start();
    }

    buildBlocks() {
        const matrix = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ];

        const blocks = BlocksBuilder.buildGamePlatform(matrix);

        return blocks;
    }
}

const level = new Level1();

const render = () => {
    level.keyboardUpdate(level);
    level.moveMiniBall();

    requestAnimationFrame(render);

    Game.render();
};

export default render;
