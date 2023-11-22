import Logs from "../../utils/Logs/index.js";

class Session {
    static lives = 5;

    static die = () => {
        this.lives--;
        Logs.updateLives(this.speed);
    };

    static reset = () => {
        this.lives = 5;
        Logs.updateLives(this.speed);
    };

    static isAlive = () => {
        return this.lives > 0;
    };
}

export default Session;
