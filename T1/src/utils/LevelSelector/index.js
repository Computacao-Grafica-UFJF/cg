import Game from "../../lib/Game/index.js";
import level1 from "../../scenes/Level1/index.js";
import level2 from "../../scenes/Level2/index.js";

class LevelSelector {
    static levels = [level1, level2];
    static currentLevel = 0;

    static changeLevel() {
        const level = this.getLevel();
        Game.changeLevel(level);
    }

    static nextLevel() {
        this.currentLevel = (this.currentLevel + 1) % this.levels.length;
        this.changeLevel();
    }

    static startLevel() {
        this.currentLevel = 0;
        this.changeLevel();
    }

    static getLevel() {
        return this.levels[this.currentLevel];
    }
}

export default LevelSelector;
