import Game from "../../lib/Game/index.js";
import level1 from "../../scenes/Level1/index.js";
import level2 from "../../scenes/Level1/index.js";

class LevelSelector {
    static levels = [level1, level2];
    static currentLevelIndex = 0;

    static getNextLevel() {
        this.currentLevel = (this.currentLevel + 1) % this.levels.length;
        return this.getLevel();
    }

    static getStartLevel() {
        this.currentLevel = 0;
        return this.getLevel();
    }

    static getLevel() {
        return this.levels[this.currentLevel];
    }
}

export default LevelSelector;
