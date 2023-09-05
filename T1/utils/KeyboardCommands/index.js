import KeyboardState from "../../../libs/util/KeyboardState.js";
import FullScreenControl from "../FullScreenControl/index.js";

class KeyboardCommands {
    constructor() {
        this.keyboardState = new KeyboardState();
        this.fullScreenControl = new FullScreenControl();
    }
}

export default KeyboardCommands;
