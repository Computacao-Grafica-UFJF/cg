import * as THREE from "three";
import Stats from "../../../build/jsm/libs/stats.module.js";
import { TrackballControls } from "../../../build/jsm/controls/TrackballControls.js";
import { initRenderer, initDefaultBasicLight } from "../../../libs/util/util.js";

import Hitter from "../../sprites/Hitter/index.js";
import Block from "../../sprites/Block/index.js";
import Platform from "../../sprites/Platform/index.js";
import MiniBall from "../../sprites/MiniBall/index.js";
import Wall from "../../sprites/Wall/index.js";
import game from "../../config/Game.js";
import KeyboardState from "../../../libs/util/KeyboardState.js";

import OrthographicCameraWrapper from "../../utils/OrthographicCameraWrapper/index.js";
import Engine from "../../utils/Engine/index.js";

const scene = new THREE.Scene();
const stats = new Stats();
const renderer = initRenderer();
const camera = new OrthographicCameraWrapper();
const trackballControls = new TrackballControls(camera, renderer.domElement);
const keyboard = new KeyboardState();
initDefaultBasicLight(scene);

class Level1 extends Engine {
    constructor(camera, renderer, scene) {
        super(camera, renderer, scene);

        this.start();
    }

    start() {
        this.gamePlatform = this.buildGamePlatform();
        this.platform = this.buildPlatform();
        this.hitter = this.buildHitter();
        this.playablePlatform = this.buildPlayablePlatform();
        this.miniBall = this.buildMiniBall();
        this.walls = [...this.buildWalls()];
        this.blocks = [...this.buildBlocks()];

        this.scene.add(...this.getElements());
    }

    restart() {
        this.scene.remove(...this.getElements());
        this.start();
    }

    buildGamePlatform() {
        const gamePlatform = new Platform(innerWidth, innerHeight, "#000");
        return gamePlatform;
    }

    buildPlatform() {
        const platform = new Platform(game.width, 2 * game.width, "#000");
        return platform;
    }

    buildHitter() {
        const hitter = new Hitter(0, -13, 0);
        return hitter;
    }

    buildBlocks() {
        const blocks = Array.from({ length: 10 }, (_, i) =>
            Array.from({ length: 10 }, (_, j) => new Block(i + i * 0.4 - 6.5, j + j * 0.4 + 2.5, 0).translateY(-1))
        ).flat();

        return blocks;
    }

    buildMiniBall() {
        const miniBall = new MiniBall(0, 0, 0);
        return miniBall;
    }

    buildWalls() {
        const wallTop = new Wall(0, game.width + 0.5, 0, game.width + 2, 1, "horizontal");
        const wallBottom = new Wall(0, -game.width - 0.5, 0, game.width + 2, 1, "horizontal");
        const wallLeft = new Wall(-game.width / 2 - 0.5, 0, 0, 1, 2 * game.width, "vertical");
        const wallRight = new Wall(game.width / 2 + 0.5, 0, 0, 1, 2 * game.width, "vertical");

        return [wallTop, wallBottom, wallLeft, wallRight];
    }

    buildPlayablePlatform() {
        const playablePlatform = new Platform(15 - this.hitter.geometry.parameters.width, 30, "#000");
        return playablePlatform;
    }

    getElements() {
        return [this.gamePlatform, this.platform, this.hitter, this.playablePlatform, this.miniBall, ...this.walls, ...this.blocks];
    }

    destroyBlock(block) {
        this.blocks = this.blocks.filter((b) => b !== block);
        this.scene.remove(block);
    }

    moveMiniBall() {
        const collisionWalls = [this.walls[0], this.walls[2], this.walls[3]];
        const deathZones = [this.walls[1]];

        this.miniBall.update(this.hitter, collisionWalls, this.blocks, deathZones, this.destroyBlock.bind(this));
    }
}

const level = new Level1(camera, renderer, scene);

const render = () => {
    stats.update();
    trackballControls.update();
    level.moveMiniBall();
    level.keyboardUpdate(level);
    requestAnimationFrame(render);

    renderer.render(scene, camera);
};

export default render;
