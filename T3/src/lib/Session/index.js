import Logs from "../../utils/Logs/index.js";

class Session {
    lives;

    constructor() {
        this.lives = 5;
    }

    die = () => {
        this.lives--;
        Logs.updateLives(this.lives);
    };

    reset = () => {
        this.lives = 5;
        Logs.updateLives(this.lives);
    };

    isAlive = () => {
        return this.lives > 0;
    };
}

export default Session;
