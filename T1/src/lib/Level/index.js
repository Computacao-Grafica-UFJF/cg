import Raycaster from "../../utils/Raycaster/index.js";
import { onWindowResize } from "../../../../libs/util/util.js";
import Game from "../Game/index.js";
import AuxiliarPlatform from "../../sprites/AuxiliarPlatform/index.js";
import Hitter from "../../sprites/Hitter/index.js";
import Platform from "../../sprites/Platform/index.js";
import MiniBall from "../../sprites/MiniBall/index.js";
import Wall from "../../sprites/Wall/index.js";
import gameConfig from "../../config/Game.js";
import BlocksBuilder from "../../utils/BlocksBuilder/index.js";

class Level {
    constructor(matrix) {
        this.matrix = matrix;
        this.paused = false;
        this.finished = false;

        this.init();
    }

    startListeners = (camera, renderer) => {
        window.addEventListener(
            "resize",
            () => {
                onWindowResize(camera, renderer, 31.5);
            },
            false
        );
        window.addEventListener("mousemove", (event) => {
            this.raycaster.onMouseMove(event, this, camera);
        });

        window.addEventListener("mousedown", (event) => {
            this.raycaster.onMouseDown(event, this);
        });
    };

    build() {
        this.raycaster = new Raycaster();
        this.startListeners(Game.camera, Game.renderer);

        this.gamePlatform = this.buildGamePlatform();
        this.platform = this.buildPlatform();
        this.hitter = this.buildHitter();
        this.playablePlatform = this.buildPlayablePlatform();
        this.miniBall = this.buildMiniBall();
        this.walls = [...this.buildWalls()];
        this.blocks = [...this.buildBlocks()];

        Game.scene.add(...this.getElements());
    }

    buildGamePlatform() {
        const gamePlatform = new Platform(innerWidth, innerHeight, "#202030");
        return gamePlatform;
    }

    buildPlatform() {
        const platform = new Platform(gameConfig.width, 2 * gameConfig.width, "#47454E");
        return platform;
    }

    buildPlayablePlatform() {
        const playablePlatform = new AuxiliarPlatform(15 - this.hitter.geometry.parameters.width, 30);
        return playablePlatform;
    }

    buildHitter() {
        const hitter = new Hitter(0, -13, 0, "#65ADBE");
        return hitter;
    }

    buildMiniBall() {
        const positionStartX = 0.8;
        const positionStartY = -12;

        const miniBall = new MiniBall(positionStartX, positionStartY, 0, "#fff");
        return miniBall;
    }

    buildWalls() {
        const wallTop = new Wall(0, gameConfig.width + 0.5, 0, gameConfig.width + 2, 1, "horizontal");
        const wallBottom = new Wall(0, -gameConfig.width - 0.5, 0, gameConfig.width + 2, 1, "horizontal");
        const wallLeft = new Wall(-gameConfig.width / 2 - 0.5, 0, 0, 1, 2 * gameConfig.width, "vertical");
        const wallRight = new Wall(gameConfig.width / 2 + 0.5, 0, 0, 1, 2 * gameConfig.width, "vertical");

        return [wallTop, wallBottom, wallLeft, wallRight];
    }

    buildBlocks() {
        const blocks = BlocksBuilder.buildGamePlatform(this.matrix);

        return blocks;
    }

    getElements() {
        return [this.gamePlatform, this.platform, this.hitter, this.playablePlatform, this.miniBall, ...this.walls, ...this.blocks];
    }

    finishedLevel() {
        return this.blocks.length === 0;
    }

    destroyBlock(block) {
        this.blocks = this.blocks.filter((b) => b !== block);
        Game.scene.remove(block);

        this.finishedLevel() && setTimeout(() => this.finish(), 10);
    }

    moveMiniBall() {
        const collisionWalls = [this.walls[0], this.walls[2], this.walls[3]];
        const deathZones = [this.walls[1]];

        this.miniBall.update(this.hitter, collisionWalls, this.blocks, deathZones, this.destroyBlock.bind(this), this.death.bind(this));
    }

    render() {
        this.moveMiniBall();
    }

    restart() {
        Game.scene.remove(...this.getElements());
        this.build();
        this.miniBall.resetPosition();
    }

    finish() {
        Game.pause();

        this.finished = true;
    }

    init() {
        if (this.finished || this.paused) return;

        if (this.miniBall && this.miniBall.isRaycasterMode) this.miniBall.start();
    }

    death() {
        this.miniBall.raycasterMode();
    }
}

export default Level;
