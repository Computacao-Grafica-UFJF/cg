import { SecondaryBox } from "../../../../libs/util/util.js";

class Logs {
    static currentSpeed = new SecondaryBox("");

    static updateCurrentSpeed(speed) {
        const formattedSpeed = speed.toFixed(4);
        this.currentSpeed.changeMessage("Speed: " + formattedSpeed);
    }
}

export default Logs;
