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
import PowerUpMultipleBalls from "../../sprites/PowerUp/PowerUpMultipleBalls/index.js";
import PowerUpFireBall from "../../sprites/PowerUp/PowerUpFireBall/index.js";

import * as THREE from "three";

class Level {
    PowerUp;
    powerUps = [PowerUpMultipleBalls, PowerUpFireBall];
    actionFunctions = [
        () => {
            this.createNewBalls();
        },
        () => {
            this.transformMiniBallInFireBall();
        },
    ];

    constructor(matrix) {
        this.matrix = matrix;
        this.blocksDestroyed = 0;
        this.blocksDestroyedLimit = gameConfig.level.blocksDestroyedLimit;
        this.activePowerUp = false;
        this.died = false;
        this.powerUpsTaken = 0;

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

        if (gameConfig.level.viewBoundingBox) this.viewBoundingBox();
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
        const platform = new Plane(gameConfig.level.width, innerHeight);
        return platform;
    }

    buildPlayablePlatform() {
        const playablePlatform = new AuxiliarPlatform(gameConfig.level.width - this.hitter.width, innerHeight);
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
        const wallTop = new Wall(0, gameConfig.level.width / 2 - 0.7, 0, gameConfig.level.width + 2, 1, "top");
        const wallBottom = new Wall(0, -gameConfig.level.width / 2 + 0.3, 0, gameConfig.level.width + 2, 1, "bottom");
        const wallLeft = new Wall(-gameConfig.level.width / 2 - 0.5, 0, 0, 1, gameConfig.level.width - 0.7, "left");
        const wallRight = new Wall(gameConfig.level.width / 2 + 0.5, 0, 0, 1, gameConfig.level.width - 0.7, "right");

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

    createNewBalls() {
        const existentMiniBall = this.miniBalls[0];

        const newMiniBall1 = new MiniBall(
            existentMiniBall.position.x,
            existentMiniBall.position.y,
            0,
            "#fff",
            existentMiniBall.speed,
            existentMiniBall.angle - THREE.MathUtils.degToRad(30)
        );

        const newMiniBall2 = new MiniBall(
            existentMiniBall.position.x,
            existentMiniBall.position.y,
            0,
            "#fff",
            existentMiniBall.speed,
            existentMiniBall.angle + Math.PI
        );

        this.miniBalls.push(newMiniBall1, newMiniBall2);
        Game.scene.add(newMiniBall1, newMiniBall2);
    }

    transformMiniBallInFireBall() {
        this.miniBalls.forEach((miniBall) => {
            miniBall.transformInFireBall();
        });

        setTimeout(() => {
            this.activePowerUp = false;
        }, gameConfig.level.miniBall.firePowerUpTime);
    }

    createPowerUp(block) {
        const getPowerUpIndex = () => {
            return this.powerUpsTaken % this.powerUps.length;
        };

        const position = block.position;
        const index = getPowerUpIndex();

        this.PowerUp = new this.powerUps[index](
            position.x,
            position.y,
            position.z + 0.6,
            this.destroyPowerUp.bind(this),
            this.actionFunctions[index].bind(this)
        );

        this.activePowerUp = true;
        Game.scene.add(this.PowerUp);
    }

    destroyPowerUp(collideWithHitter) {
        if (collideWithHitter) {
            if (this.miniBalls.length > 1) {
                return;
            }

            this.activePowerUp = true;
            this.powerUpsTaken++;
            Game.scene.remove(this.PowerUp);
            this.PowerUp.actionFunction();
            return;
        }

        Game.scene.remove(this.PowerUp);
        this.activePowerUp = false;
        this.PowerUp = null;
        this.blocksDestroyed = 0;
    }

    destroyPowerUpOnEndGame() {
        if (!this.PowerUp) return;

        Game.scene.remove(this.PowerUp);
        this.PowerUp.destructor();
        this.PowerUp = null;
    }

    checkPowerUp(block) {
        if (this.activePowerUp) return;

        this.blocksDestroyed++;

        if (this.blocksDestroyed >= this.blocksDestroyedLimit) {
            this.createPowerUp(block);
        }
    }

    destroyBlock(block) {
        this.checkPowerUp(block);
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
            miniBall.update(this.hitter, collisionWalls, this.blocks, deathZones, this.hitBlock.bind(this), this.destroyBall.bind(this));
        });
    }

    render() {
        this.moveMiniBall();

        if (this.PowerUp) {
            this.PowerUp.move(this.hitter);
        }
    }

    restart() {
        this.destructor();

        this.build(this.nextLevel.bind(this));

        this.miniBalls.forEach((miniBall) => {
            miniBall.resetPosition();
        });

        this.activePowerUp = false;
        this.blocksDestroyed = 0;
        this.powerUpsTaken = 0;
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

    restartLevel() {
        this.miniBalls.forEach((miniBall) => {
            miniBall.raycasterMode();
        });
        this.died = false;
    }

    die() {
        this.died = true;
        this.destroyPowerUpOnEndGame();
        this.powerUpsTaken = 0;
        Logs.updateCurrentSpeed(0);
        Game.session.die();

        if (!Game.session.isAlive()) {
            Game.gameOver();
        }

        setTimeout(() => {
            this.restartLevel();
        }, 500);
    }

    destroyBall(miniBall) {
        if (this.died) return;

        if (this.miniBalls.length > 1) {
            Game.scene.remove(miniBall);
            this.miniBalls = this.miniBalls.filter((ball) => ball.id !== miniBall.id);
            miniBall.destructor();

            if (this.miniBalls.length === 1) {
                this.activePowerUp = false;
                this.blocksDestroyed = 0;
            }

            return;
        }

        this.die();
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
        if (this.PowerUp) Game.scene.remove(this.PowerUp);

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
