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

import * as THREE from "three";

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

    viewBoundingBox() {
        const createBoundingBoxes = () => {
            const hitterCenterMiddle = this.hitter.position;

            const leftLeftMin = new THREE.Vector3(
                hitterCenterMiddle.x - this.hitter.radius,
                hitterCenterMiddle.y,
                hitterCenterMiddle.z - this.hitter.radius / 4
            );
            const leftLeftMax = new THREE.Vector3(
                hitterCenterMiddle.x - this.hitter.radius / 1.2,
                hitterCenterMiddle.y + this.hitter.radius / 4,
                hitterCenterMiddle.z + this.hitter.radius / 4
            );
            const leftLeftBoundingBox = new THREE.Box3(leftLeftMin, leftLeftMax);

            const leftMin = new THREE.Vector3(
                hitterCenterMiddle.x - this.hitter.radius / 1.2,
                hitterCenterMiddle.y,
                hitterCenterMiddle.z - this.hitter.radius / 4
            );
            const leftMax = new THREE.Vector3(
                hitterCenterMiddle.x - this.hitter.radius / 1.5,
                hitterCenterMiddle.y + this.hitter.radius / 3,
                hitterCenterMiddle.z + this.hitter.radius / 4
            );
            const leftBoundingBox = new THREE.Box3(leftMin, leftMax);

            const middleMin = new THREE.Vector3(
                hitterCenterMiddle.x - this.hitter.radius / 1.5,
                hitterCenterMiddle.y,
                hitterCenterMiddle.z - this.hitter.radius / 4
            );
            const middleMax = new THREE.Vector3(
                hitterCenterMiddle.x + this.hitter.radius / 1.5,
                hitterCenterMiddle.y + this.hitter.radius / 2,
                hitterCenterMiddle.z + this.hitter.radius / 4
            );
            const middleBoundingBox = new THREE.Box3(middleMin, middleMax);

            const rightMin = new THREE.Vector3(
                hitterCenterMiddle.x + this.hitter.radius / 1.5,
                hitterCenterMiddle.y,
                hitterCenterMiddle.z - this.hitter.radius / 4
            );
            const rightMax = new THREE.Vector3(
                hitterCenterMiddle.x + this.hitter.radius / 1.2,
                hitterCenterMiddle.y + this.hitter.radius / 3,
                hitterCenterMiddle.z + this.hitter.radius / 4
            );
            const rightBoundingBox = new THREE.Box3(rightMin, rightMax);

            const rightRightMin = new THREE.Vector3(
                hitterCenterMiddle.x + this.hitter.radius / 1.2,
                hitterCenterMiddle.y,
                hitterCenterMiddle.z - this.hitter.radius / 4
            );
            const rightRightMax = new THREE.Vector3(
                hitterCenterMiddle.x + this.hitter.radius,
                hitterCenterMiddle.y + this.hitter.radius / 4,
                hitterCenterMiddle.z + this.hitter.radius / 4
            );
            const rightRightBoundingBox = new THREE.Box3(rightRightMin, rightRightMax);

            return { leftLeftBoundingBox, leftBoundingBox, middleBoundingBox, rightRightBoundingBox, rightBoundingBox };
        };

        const { leftLeftBoundingBox, leftBoundingBox, middleBoundingBox, rightRightBoundingBox, rightBoundingBox } = createBoundingBoxes();
        const hitterBoundingBoxHelper1 = new THREE.Box3Helper(leftLeftBoundingBox, 0xffaaff);
        const hitterBoundingBoxHelper3 = new THREE.Box3Helper(leftBoundingBox, 0x000);
        const hitterBoundingBoxHelper2 = new THREE.Box3Helper(middleBoundingBox, 0xffff00);
        const hitterBoundingBoxHelper4 = new THREE.Box3Helper(rightRightBoundingBox, 0xfc0303);
        const hitterBoundingBoxHelper5 = new THREE.Box3Helper(rightBoundingBox, 0x0352fc);

        Game.scene.add(hitterBoundingBoxHelper1);
        Game.scene.add(hitterBoundingBoxHelper2);
        Game.scene.add(hitterBoundingBoxHelper3);
        Game.scene.add(hitterBoundingBoxHelper4);
        Game.scene.add(hitterBoundingBoxHelper5);

        const ballBoundingBox = new THREE.Box3().setFromObject(this.miniBall);
        const ballBoundingBoxHelper = new THREE.Box3Helper(ballBoundingBox, 0xffff00);
        Game.scene.add(ballBoundingBoxHelper);
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
        const positionStartX = 0.0;
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

    destroyBlock(block) {
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
