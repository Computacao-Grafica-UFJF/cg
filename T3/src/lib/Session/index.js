import gameConfig from "../../config/Game.js";

class Session {
    lives;

    constructor() {
        this.lives = gameConfig.session.lives;
        console.log(this.lives);
    }

    die = () => {
        this.lives--;
        console.log(this.lives);
    };

    reset = () => {
        this.lives = gameConfig.session.lives;
        console.log(this.lives);
    };

    isAlive = () => {
        return this.lives >= 0;
    };
}

export default Session;
