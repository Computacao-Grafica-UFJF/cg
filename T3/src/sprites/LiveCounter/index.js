import Live from "./Live/index.js";

class LiveCounter {
    static lives;
    static marginLeft = 18;
    static marginBottom = 12.5;
    static padding = 1.5;

    static getRenderLives() {
        const livesSprites = new Array(this.lives).fill(null).map((_, i) => {
            return new Live(this.marginLeft + i * this.padding, this.marginBottom, 1);
        });

        return livesSprites;
    }

    static update(lives) {
        this.lives = lives;
    }
}

export default LiveCounter;
