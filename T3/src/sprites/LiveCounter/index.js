import Live from "./Live/index.js";

class LiveCounter {
    constructor(startLives) {
        this.lives = startLives;
    }

    static getRenderLives() {
        const livesSprites = new Array(this.lives).fill(null).map((_, i) => {
            return new Live(1, 1, 1 + i * 2);
        });

        return livesSprites;
    }

    static update(lives) {
        this.lives = lives;
    }
}

export default LiveCounter;
