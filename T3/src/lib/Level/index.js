import { onWindowResize } from "../../../../libs/util/util.js";

import Raycaster from "../../utils/Raycaster/index.js";
import Logs from "../../utils/Logs/index.js";
import Game from "../Game/index.js";
import AuxiliarPlatform from "../../sprites/AuxiliarPlatform/index.js";
import Hitter from "../../sprites/Hitter/index.js";
import Platform from "../../sprites/Platform/index.js";
import MiniBall from "../../sprites/MiniBall/index.js";
import Wall from "../../sprites/Wall/index.js";
import gameConfig from "../../config/Game.js";
import BlocksBuilder from "../../utils/BlocksBuilder/index.js";
import Plane from "../../sprites/Plane/index.js";
import PowerUp1 from "../../sprites/PowerUp1/index.js";

import * as THREE from "three";

class Level {
    powerUp1;

    constructor(matrix) {
        this.matrix = matrix;
        this.blocksDestroyed = 0;
        this.blocksDestroyedLimit = 1;
        this.activePowerUp1 = false;

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

        Logs.updateCurrentSpeed(0);

        this.miniBalls = [this.buildMiniBall()];
        this.walls = [...this.buildWalls()];
        this.blocks = [...this.buildBlocks()];

        Game.scene.add(...this.getElements());

        // this.viewBoundingBox();
    }

    buildGamePlatform() {
        const path = "./assets/texture/skybox/";
        const format = ".png";
        const urls = [
            path + "right" + format,
            path + "left" + format,
            path + "top" + format,
            path + "bottom" + format,
            path + "front" + format,
            path + "back" + format,
        ];
        const cubeMapTexture = new THREE.CubeTextureLoader().load(urls);
        Game.scene.background = cubeMapTexture;

        const gamePlatform = new Platform(innerWidth, innerHeight, "#ffffff", cubeMapTexture);
        return gamePlatform;
    }

    buildPlatform() {
        const platform = new Plane(gameConfig.width, innerHeight);
        return platform;
    }

    buildPlayablePlatform() {
        const playablePlatform = new AuxiliarPlatform(gameConfig.width - this.hitter.width, innerHeight);
        return playablePlatform;
    }

    buildHitter() {
        const hitter = new Hitter(0, 0, -13, "#65ADBE");
        return hitter;
    }

    buildMiniBall() {
        const positionStartX = 0;
        const positionStartY = -12;

        const miniBall = new MiniBall(positionStartX, positionStartY, 0, "#fff");
        return miniBall;
    }

    buildWalls() {
        const wallTop = new Wall(0, gameConfig.width / 2 - 0.7, 0, gameConfig.width + 2, 1, "top");
        const wallBottom = new Wall(0, -gameConfig.width / 2 + 0.3, 0, gameConfig.width + 2, 1, "bottom");
        const wallLeft = new Wall(-gameConfig.width / 2 - 0.5, 0, 0, 1, gameConfig.width - 0.7, "left");
        const wallRight = new Wall(gameConfig.width / 2 + 0.5, 0, 0, 1, gameConfig.width - 0.7, "right");

        return [wallTop, wallBottom, wallLeft, wallRight];
    }

    buildBlocks() {
        const blocks = BlocksBuilder.buildGamePlatform(this.matrix);

        return blocks;
    }

    getElements() {
        return [this.gamePlatform, this.platform, this.hitter, this.playablePlatform, ...this.miniBalls, ...this.walls, ...this.blocks];
    }

    hitBlock(block) {
        const destroyedOnHit = block.hit();

        if (destroyedOnHit) this.destroyBlock(block);
    }

    createNewBall() {
        const existentMiniBall = this.miniBalls[0];

        const newMiniBall = new MiniBall(
            existentMiniBall.position.x,
            existentMiniBall.position.y,
            0,
            "#fff",
            existentMiniBall.speed,
            existentMiniBall.angle - Math.PI
        );

        this.miniBalls.push(newMiniBall);
        Game.scene.add(newMiniBall);
    }

    createPowerUp1(block) {
        const position = block.position;

        this.powerUp1 = new PowerUp1(position.x, position.y, position.z + 0.6, this.destroyPowerUp1.bind(this));
        this.activePowerUp1 = true;
        Game.scene.add(this.powerUp1);
    }

    destroyPowerUp1(collideWithHitter) {
        if (collideWithHitter) {
            if (this.miniBalls.length > 1) {
                return;
            }

            this.activePowerUp1 = true;
            Game.scene.remove(this.powerUp1);
            this.createNewBall();
            return;
        }

        Game.scene.remove(this.powerUp1);
        this.activePowerUp1 = false;
        this.powerUp1 = null;
        this.blocksDestroyed = 0;
    }

    destroyPowerUp1OnEndGame() {
        if (!this.powerUp1) return;

        Game.scene.remove(this.powerUp1);
        this.powerUp1.destructor();
        this.powerUp1 = null;
    }

    checkPowerUp1(block) {
        if (this.activePowerUp1 || this.miniBalls.length > 1) return;

        this.blocksDestroyed++;

        if (this.blocksDestroyed >= this.blocksDestroyedLimit) {
            this.createPowerUp1(block);
        }
    }

    destroyBlock(block) {
        this.checkPowerUp1(block);
        this.blocks = this.blocks.filter((b) => b !== block);
        Game.scene.remove(block);

        if (this.blocks.length === 0) {
            this.finish();
        }
    }

    moveMiniBall() {
        const collisionWalls = [this.walls[0], this.walls[2], this.walls[3]];
        const deathZones = [this.walls[1]];

        this.miniBalls.forEach((miniBall) => {
            miniBall.update(this.hitter, collisionWalls, this.blocks, deathZones, this.hitBlock.bind(this), this.death.bind(this));
        });
    }

    render() {
        this.moveMiniBall();

        if (this.powerUp1) {
            this.powerUp1.move(this.hitter);
        }
    }

    restart() {
        this.destructor();

        this.build(this.nextLevel.bind(this));

        this.miniBalls.forEach((miniBall) => {
            miniBall.resetPosition();
        });

        this.activePowerUp1 = false;
        this.blocksDestroyed = 0;
    }

    finish() {
        this.nextLevel();
    }

    init() {
        if (Game.paused) return;

        if (this.miniBalls) {
            this.miniBalls.forEach((miniBall) => {
                if (miniBall.isRaycasterMode) miniBall.start();
            });
        }
    }

    gameOver() {
        this.destroyPowerUp1OnEndGame();

        Logs.updateCurrentSpeed(0);

        setTimeout(
            () =>
                this.miniBalls.forEach((miniBall) => {
                    miniBall.raycasterMode();
                }),
            500
        );
    }

    death(miniBall) {
        this.activePowerUp1 = false;
        this.blocksDestroyed = 0;

        if (this.miniBalls.length > 1) {
            Game.scene.remove(miniBall);
            this.miniBalls = this.miniBalls.filter((ball) => ball.id !== miniBall.id);
            miniBall.destructor();
            return;
        }

        this.gameOver();
    }

    viewBoundingBox() {
        const createHitterBoundingBoxes = () => {
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

            const hitterBoundingBoxHelper1 = new THREE.Box3Helper(leftLeftBoundingBox, 0xffaaff);
            const hitterBoundingBoxHelper3 = new THREE.Box3Helper(leftBoundingBox, 0x000);
            const hitterBoundingBoxHelper2 = new THREE.Box3Helper(middleBoundingBox, 0xffff00);
            const hitterBoundingBoxHelper4 = new THREE.Box3Helper(rightRightBoundingBox, 0xfc0303);
            const hitterBoundingBoxHelper5 = new THREE.Box3Helper(rightBoundingBox, 0x0352fc);

            Game.scene.add(
                hitterBoundingBoxHelper1,
                hitterBoundingBoxHelper2,
                hitterBoundingBoxHelper3,
                hitterBoundingBoxHelper4,
                hitterBoundingBoxHelper5
            );
        };

        const createMiniBallBoundingBoxes = () => {
            this.miniBalls.forEach((miniBall) => {
                const ballBoundingBox = new THREE.Box3().setFromObject(miniBall);
                const ballBoundingBoxHelper = new THREE.Box3Helper(ballBoundingBox, "purple");
                Game.scene.add(ballBoundingBoxHelper);
            });
        };

        const createAuxiliarSphere = () => {
            const sphereGeometry = new THREE.SphereGeometry(0.1, 8, 8);
            const sphereMaterial = new THREE.MeshBasicMaterial({ color: "green" });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

            const hitterCenter = this.hitter.position;
            sphere.position.set(hitterCenter.x, hitterCenter.y, hitterCenter.z);

            Game.scene.add(sphere);
        };

        const createBlockBoundingBoxes = () => {
            this.blocks.forEach((block) => {
                const blockBoundingBox = new THREE.Box3().setFromObject(block);
                const blockBoundingBoxHelper = new THREE.Box3Helper(blockBoundingBox, "blue");
                Game.scene.add(blockBoundingBoxHelper);
            });
        };

        createHitterBoundingBoxes();
        createMiniBallBoundingBoxes();
        createBlockBoundingBoxes();
        createAuxiliarSphere();
    }

    destructor() {
        Game.scene.remove(...this.getElements());
        if (this.powerUp1) Game.scene.remove(this.powerUp1);

        this.miniBalls.forEach((miniBall) => {
            miniBall.destructor();
        });

        this.hitter.destructor();

        this.blocks.forEach((block) => {
            block.destructor();
        });

        this.walls.forEach((wall) => {
            wall.destructor();
        });
    }
}

export default Level;
