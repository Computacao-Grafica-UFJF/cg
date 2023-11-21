import Game from "../../lib/Game/index.js";
import level1 from "../../scenes/Level1/index.js";
import level2 from "../../scenes/Level2/index.js";
import level3 from "../../scenes/Level3/index.js";

class LevelSelector {
    static levels = [level1, level2, level3];
    static currentLevelIndex = 0;
    static currentLevel = null;

    static nextLevel() {
        this.currentLevelIndex++;

        if (this.currentLevelIndex >= this.levels.length) {
            this.currentLevelIndex = 0;
        }

        this.changeLevel();
    }

    static startLevel() {
        this.currentLevelIndex = 0;
        this.changeLevel();
    }

    static changeLevel() {
        this.currentLevel = this.getLevel();
        Game.changeLevel();
        this.currentLevel.build(this.nextLevel.bind(this));
    }

    static getLevel() {
        return this.levels[this.currentLevelIndex];
    }
}

export default LevelSelector;
