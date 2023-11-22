import Game from "./src/lib/Game/index.js";
import LevelSelector from "./src/utils/LevelSelector/index.js";
import Keyboard from "./src/utils/Keyboard/index.js";

import GUI from "../libs/util/dat.gui.module.js";

LevelSelector.startLevel();

const render = () => {
    Keyboard.keyboardListening(LevelSelector.currentLevel);

    LevelSelector.currentLevel.render();

    Game.render(render);
};

render();
