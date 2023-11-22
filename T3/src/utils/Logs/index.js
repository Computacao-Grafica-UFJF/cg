import { SecondaryBox } from "../../../../libs/util/util.js";

class Logs {
    static currentSpeed = new SecondaryBox("");
    static lives = new SecondaryBox("");

    static updateCurrentSpeed(speed) {
        const formattedSpeed = speed.toFixed(4);
        this.currentSpeed.changeMessage("Speed: " + formattedSpeed);
    }

    static updateLives(lives) {
        this.lives.changeMessage("Lives: " + lives);
    }
}

export default Logs;
