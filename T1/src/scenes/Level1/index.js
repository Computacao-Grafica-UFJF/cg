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
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ];

        const blocks = BlocksBuilder.buildGamePlatform(matrix);

        return blocks;
    }
}

const level = new Level1();

const render = () => {
    Game.keyboardUpdate(level);


    Game.render(render);
};

export default render;



import Level from "../../lib/Level/index.js";

const matrix = [
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const level1 = new Level(matrix);

export default level1;
