import KeyboardState from "../../../libs/util/KeyboardState.js";
import FullScreenControl from "../FullScreenControl/index.js";

class KeyboardCommands {
    constructor() {
        this.keyboardState = new KeyboardState();
        this.fullScreenControl = new FullScreenControl();
    }

    listenCommands(level) {
        if (this.keyboardState.down("R")) level.restart();
        if (this.keyboardState.down("space")) level.pause();
        if (this.keyboardState.down("enter")) this.fullScreenControl.toggleFullScreen();
    }
}

export default KeyboardCommands;
