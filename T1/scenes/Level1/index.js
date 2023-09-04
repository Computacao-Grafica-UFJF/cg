import * as THREE from "three";
import Stats from "../../../build/jsm/libs/stats.module.js";
import { TrackballControls } from "../../../build/jsm/controls/TrackballControls.js";
import { initRenderer, initDefaultBasicLight, onWindowResize } from "../../../libs/util/util.js";

import Hitter from "../../sprites/Hitter/index.js";
import Block from "../../sprites/Block/index.js";
import Platform from "../../sprites/Platform/index.js";
import Raycaster from "../../utils/Raycaster/index.js";
import MiniBall from "../../sprites/MiniBall/index.js";
import Wall from "../../sprites/Wall/index.js";
import game from "../../config/Game.js";

import OrthographicCameraWrapper from "../../utils/OrthographicCameraWrapper/index.js";

const scene = new THREE.Scene();
const stats = new Stats();
const renderer = initRenderer();
const camera = new OrthographicCameraWrapper();
const trackballControls = new TrackballControls(camera, renderer.domElement);
initDefaultBasicLight(scene);

class Level1 {
    constructor() {
        this.gamePlatform = this.buildGamePlatform();
        this.platform = this.buildPlatform();
        this.hitter = this.buildHitter();
        this.playablePlatform = this.buildPlayablePlatform();
        this.miniBall = this.buildMiniBall();
        this.walls = [...this.buildWalls()];
        this.blocks = [...this.buildBlocks()];

        this.raycaster = new Raycaster();
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
        const wallBottom = new Wall(0, game.width + 0.5, 0, game.width + 2, 1);
        const wallTop = new Wall(0, -game.width - 0.5, 0, game.width + 2, 1);
        const wallLeft = new Wall(-game.width / 2 - 0.5, 0, 0, 1, 2 * game.width);
        const wallRight = new Wall(game.width / 2 + 0.5, 0, 0, 1, 2 * game.width);

        return [wallLeft, wallRight, wallTop, wallBottom];
    }

    buildPlayablePlatform() {
        const playablePlatform = new Platform(15 - this.hitter.geometry.parameters.width, 30, "#000");
        return playablePlatform;
    }

    getElements() {
        return [this.gamePlatform, this.platform, this.hitter, this.playablePlatform, this.miniBall, ...this.walls, ...this.blocks];
    }

    moveMiniBall() {
        this.miniBall.update();
    }
}

const startListeners = (level, camera, renderer) => {
    window.addEventListener(
        "resize",
        () => {
            onWindowResize(camera, renderer, 40);
        },
        false
    );
    window.addEventListener("mousemove", (event) => {
        level.raycaster.onMouseMove(event, level, camera);
    });
};

const level = new Level1();

scene.add(...level.getElements());

startListeners(level, camera, renderer);

const render = () => {
    stats.update();
    trackballControls.update();
    level.moveMiniBall();
    requestAnimationFrame(render);

    renderer.render(scene, camera);
};

export default render;
