import Game from "./src/lib/Game/index.js";
import LevelSelector from "./src/utils/LevelSelector/index.js";
import KeyboardCommands from "./src/utils/KeyboardCommands/index.js";

Game.init();

LevelSelector.startLevel();

const render = () => {
    KeyboardCommands.keyboardUpdate(LevelSelector.currentLevel);

    LevelSelector.currentLevel.render();

    Game.render(render);
};

render();
