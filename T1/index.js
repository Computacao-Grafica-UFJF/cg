import Game from "./src/lib/Game/index.js";
import LevelSelector from "./src/utils/LevelSelector/index.js";

Game.init();

const level = LevelSelector.getStartLevel();

const render = () => {
    Game.keyboardUpdate(level);

    level.render();

    Game.render(render);
};

render();
