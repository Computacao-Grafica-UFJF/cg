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
import Plane from "../../sprites/Plane/index.js";
import PowerUp from "../../sprites/PowerUp/index.js";

class Level {
    powerUp;

    constructor(matrix) {
        this.matrix = matrix;
        this.paused = false;
        this.blocksDestroyed = 0;
        this.activePowerUp = false;

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

    build(nextLevel) {
        this.nextLevel = nextLevel;
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
        const platform = new Plane();
        return platform;
    }

    buildPlayablePlatform() {
        const playablePlatform = new AuxiliarPlatform(15 - this.hitter.width, 30);
        return playablePlatform;
    }

    buildHitter() {
        const hitter = new Hitter(0, 0, -13, "#65ADBE");
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

    hitBlock(block) {
        const destroyedOnHit = block.hit();

        if (destroyedOnHit) this.destroyBlock(block);
    }

    createPowerUp(block) {
        const getBlockPosition = () => {
            return block.position;
        };

        const position = getBlockPosition();

        this.powerUp = new PowerUp(position.x, position.y, position.z, this.destroyPowerUp.bind(this));
        this.activePowerUp = true;
        Game.scene.add(this.powerUp);
    }

    destroyPowerUp(collideWithHitter) {
        if (collideWithHitter) {
            console.log("collideWithHitter");
        }

        this.activePowerUp = false;
        Game.scene.remove(this.powerUp);
        this.powerUp = null;
        this.blocksDestroyed = 0;
    }

    checkPowerUp(block) {
        if (this.activePowerUp) return;

        this.blocksDestroyed++;

        if (this.blocksDestroyed >= 2) {
            this.createPowerUp(block);
        }
    }

    destroyBlock(block) {
        this.checkPowerUp(block);
        this.blocks = this.blocks.filter((b) => b !== block);
        Game.scene.remove(block);

        this.finishedLevel() && setTimeout(() => this.finish(), 10);
    }

    moveMiniBall() {
        const collisionWalls = [this.walls[0], this.walls[2], this.walls[3]];
        const deathZones = [this.walls[1]];

        this.miniBall.update(this.hitter, collisionWalls, this.blocks, deathZones, this.hitBlock.bind(this), this.death.bind(this));
    }

    render() {
        this.moveMiniBall();

        if (this.powerUp) {
            this.powerUp.move(this.hitter);
        }
    }

    restart() {
        Game.scene.remove(...this.getElements());
        this.build();
        this.miniBall.resetPosition();
        this.activePowerUp = false;
        this.blocksDestroyed = 0;
    }

    finish() {
        if (this.nextLevel) this.nextLevel();
    }

    init() {
        if (this.paused) return;

        if (this.miniBall && this.miniBall.isRaycasterMode) this.miniBall.start();
    }

    death() {
        this.miniBall.raycasterMode();
    }
}

export default Level;
