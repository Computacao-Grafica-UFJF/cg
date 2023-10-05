import KeyboardState from "../../../../libs/util/KeyboardState.js";
import Game from "../../lib/Game/index.js";
import FullScreenControl from "../FullScreenControl/index.js";
import LevelSelector from "../LevelSelector/index.js";

class KeyboardCommands {
    static keyboardState = new KeyboardState();
    static fullScreenControl = new FullScreenControl();

    static listenCommands(level) {
        if (this.keyboardState.down("R")) level.restart();
        if (this.keyboardState.down("space")) Game.pause();
        if (this.keyboardState.down("enter")) this.fullScreenControl.toggleFullScreen();
        if (this.keyboardState.down("G")) LevelSelector.nextLevel();
    }

    static keyboardListening = (level) => {
        this.keyboardState.update();
        this.listenCommands(level);
    };
}

export default KeyboardCommands;
