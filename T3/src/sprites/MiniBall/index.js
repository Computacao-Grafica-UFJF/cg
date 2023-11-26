import * as THREE from "three";
import AngleHandler from "../../utils/AngleHandler/index.js";
import Game from "../../lib/Game/index.js";
import Logs from "../../utils/Logs/index.js";
import gameConfig from "../../config/Game.js";
import SoundPlayer from "../../utils/SoundPlayer/index.js";

export class MiniBall extends THREE.Mesh {
    constructor(x, y, z, color, startSpeed = 0, startAngle = 0) {
        const geometry = new THREE.SphereGeometry(0.3, 32, 32);
        const material = new THREE.MeshPhongMaterial({ color, shininess: 1000 });

        super(geometry, material);

        this.died = false;
        this.destroyed = false;
        this.isRaycasterMode = startSpeed === 0 ? true : false;
        this.minSpeed = gameConfig.level.miniBall.startSpeed;
        this.maxSpeed = this.minSpeed * 2;
        this.speed = startSpeed || this.minSpeed;
        this.radius = 0.5;
        this.evadeTimeHitter = 100;
        this.evadeTimeBlock = 20;
        this.fireBall = false;

        this.evadeModeHitter = false;
        this.evadeModeBlock = false;

        this.castShadow = true;

        this.startX = x;
        this.startY = y;
        this.startZ = z;

        if (startSpeed && startAngle) {
            this.position.set(this.startX, this.startY, this.startZ);
            this.rotate(startAngle);
            this.increaseSpeedGradually();
            return;
        }

        this.resetPosition();
    }

    resetPosition() {
        this.position.set(this.startX, this.startY, this.startZ);
        this.rotate(THREE.MathUtils.degToRad(90));
    }

    increaseSpeedGradually() {
        const duration = 30000;
        const increment = ((this.maxSpeed - this.minSpeed) / duration) * 1000;

        const increase = () => {
            if (this.destroyed || this.died) return;

            if (this.speed < this.maxSpeed) {
                if (!this.isRaycasterMode && !Game.paused) {
                    this.speed += increment;
                    Logs.updateCurrentSpeed(this.speed);
                }

                setTimeout(increase, 500);
                return;
            }

            this.speed = this.maxSpeed;
        };

        this.speed = this.speed - increment;

        increase();
    }

    rotate(angle) {
        this.angle = angle;
        this.rotation.set(0, 0, this.angle);
    }

    activateEvadeModeHitter() {
        this.evadeModeHitter = true;
        setTimeout(() => (this.evadeModeHitter = false), this.evadeTimeHitter);
    }

    activateEvadeModeBlock() {
        this.evadeModeBlock = true;
        setTimeout(() => (this.evadeModeBlock = false), this.evadeTimeBlock);
    }

    collisionWithHitter = (hitter) => {
        const createBoundingBoxes = () => {
            const hitterCenterMiddle = hitter.position;

            const leftLeftMin = new THREE.Vector3(
                hitterCenterMiddle.x - hitter.radius,
                hitterCenterMiddle.y,
                hitterCenterMiddle.z - hitter.radius / 4
            );
            const leftLeftMax = new THREE.Vector3(
                hitterCenterMiddle.x - hitter.radius / 1.2,
                hitterCenterMiddle.y + hitter.radius / 4,
                hitterCenterMiddle.z + hitter.radius / 4
            );
            const leftLeftBoundingBox = new THREE.Box3(leftLeftMin, leftLeftMax);

            const leftMin = new THREE.Vector3(
                hitterCenterMiddle.x - hitter.radius / 1.2,
                hitterCenterMiddle.y,
                hitterCenterMiddle.z - hitter.radius / 4
            );
            const leftMax = new THREE.Vector3(
                hitterCenterMiddle.x - hitter.radius / 1.5,
                hitterCenterMiddle.y + hitter.radius / 3,
                hitterCenterMiddle.z + hitter.radius / 4
            );
            const leftBoundingBox = new THREE.Box3(leftMin, leftMax);

            const middleMin = new THREE.Vector3(
                hitterCenterMiddle.x - hitter.radius / 1.5,
                hitterCenterMiddle.y,
                hitterCenterMiddle.z - hitter.radius / 4
            );
            const middleMax = new THREE.Vector3(
                hitterCenterMiddle.x + hitter.radius / 1.5,
                hitterCenterMiddle.y + hitter.radius / 2,
                hitterCenterMiddle.z + hitter.radius / 4
            );
            const middleBoundingBox = new THREE.Box3(middleMin, middleMax);

            const rightMin = new THREE.Vector3(
                hitterCenterMiddle.x + hitter.radius / 1.5,
                hitterCenterMiddle.y,
                hitterCenterMiddle.z - hitter.radius / 4
            );
            const rightMax = new THREE.Vector3(
                hitterCenterMiddle.x + hitter.radius / 1.2,
                hitterCenterMiddle.y + hitter.radius / 3,
                hitterCenterMiddle.z + hitter.radius / 4
            );
            const rightBoundingBox = new THREE.Box3(rightMin, rightMax);

            const rightRightMin = new THREE.Vector3(
                hitterCenterMiddle.x + hitter.radius / 1.2,
                hitterCenterMiddle.y,
                hitterCenterMiddle.z - hitter.radius / 4
            );
            const rightRightMax = new THREE.Vector3(
                hitterCenterMiddle.x + hitter.radius,
                hitterCenterMiddle.y + hitter.radius / 4,
                hitterCenterMiddle.z + hitter.radius / 4
            );
            const rightRightBoundingBox = new THREE.Box3(rightRightMin, rightRightMax);

            return { leftLeftBoundingBox, leftBoundingBox, middleBoundingBox, rightBoundingBox, rightRightBoundingBox };
        };

        const { leftLeftBoundingBox, leftBoundingBox, middleBoundingBox, rightBoundingBox, rightRightBoundingBox } = createBoundingBoxes(hitter);

        const ballBoundingBox = new THREE.Box3().setFromObject(this);

        if (
            (ballBoundingBox.intersectsBox(leftLeftBoundingBox) ||
                ballBoundingBox.intersectsBox(leftBoundingBox) ||
                ballBoundingBox.intersectsBox(middleBoundingBox) ||
                ballBoundingBox.intersectsBox(rightBoundingBox) ||
                ballBoundingBox.intersectsBox(rightRightBoundingBox)) &&
            this.evadeModeHitter === false
        ) {
            SoundPlayer.playByKey("hitter");
            this.activateEvadeModeHitter();
            const centerHitter = hitter.position;

            const axis = new THREE.Vector3(1, 0, 0);
            const normal = new THREE.Vector3();
            normal.subVectors(this.position, centerHitter);

            const angleNormal = normal.angleTo(axis);

            const angle = hitter.getKickBallAngle(this.angle, angleNormal);

            this.rotate(angle);
        }
    };

    collisionWithWalls = (walls) => {
        const invertAngleByWallDirection = (wall) => {
            if (AngleHandler.checkWallDirectionIsCorrect(this.angle, wall.type)) {
                if (wall.type === "top" || wall.type === "bottom") this.invertAngleVertically(this.angle);
                if (wall.type === "left" || wall.type === "right") this.invertAngleHorizontally(this.angle);
                return;
            }
        };

        const ballBoundingBox = new THREE.Box3().setFromObject(this);

        walls.forEach((wall) => {
            const wallBoundingBox = new THREE.Box3().setFromObject(wall);

            if (ballBoundingBox.intersectsBox(wallBoundingBox)) {
                invertAngleByWallDirection(wall);
                return;
            }
        });
    };

    invertAngleHorizontally(angle) {
        this.rotate(AngleHandler.invertAngleHorizontally(angle));
    }

    invertAngleVertically(angle) {
        this.rotate(AngleHandler.invertAngleVertically(angle));
    }

    changeAngleByBlock(block, angle) {
        const ballLeft = this.position.x - this.radius;
        const ballRight = this.position.x + this.radius;
        const ballTop = this.position.y + this.radius;
        const ballBottom = this.position.y - this.radius;

        const blockLeft = block.position.x - block.geometry.parameters.depth / 2;
        const blockRight = block.position.x + block.geometry.parameters.depth / 2;
        const blockTop = block.position.y + block.geometry.parameters.height / 2;
        const blockBottom = block.position.y - block.geometry.parameters.height / 2;

        const leftCollisionDistance = Math.abs(ballLeft - blockRight);
        const rightCollisionDistance = Math.abs(ballRight - blockLeft);
        const topCollisionDistance = Math.abs(ballTop - blockBottom);
        const bottomCollisionDistance = Math.abs(ballBottom - blockTop);

        const minCollisionDistance = Math.min(leftCollisionDistance, rightCollisionDistance, topCollisionDistance, bottomCollisionDistance);

        if (minCollisionDistance === leftCollisionDistance || minCollisionDistance === rightCollisionDistance) {
            this.invertAngleHorizontally(angle);
            return;
        }

        this.invertAngleVertically(angle);
    }

    playBlockSound = (type) => {
        SoundPlayer.playByKey(`${type}Block`);
    };

    collisionWithBlocks = (blocks, hitBlock) => {
        const ballBoundingBox = new THREE.Box3().setFromObject(this);
        const currentAngle = this.angle;

        blocks.find((block) => {
            const blockBoundingBox = new THREE.Box3().setFromObject(block);
            if (ballBoundingBox.intersectsBox(blockBoundingBox) && this.evadeModeBlock === false) {
                if (!this.fireBall) {
                    this.playBlockSound(block.type);
                    this.changeAngleByBlock(block, currentAngle);
                    this.activateEvadeModeBlock();
                } else {
                    SoundPlayer.playByKey("fireBall");
                }

                hitBlock(block);

                return 1;
            }
        });
    };

    collisionWithDeathZones(deathZones, death) {
        const ballBoundingBox = new THREE.Box3().setFromObject(this);
        deathZones.forEach((deathZone) => {
            const wallBoundingBox = new THREE.Box3().setFromObject(deathZone);
            if (ballBoundingBox.intersectsBox(wallBoundingBox)) {
                this.die(death);
            }
        });
    }

    transformInFireBall() {
        this.fireBall = true;
        this.material.color.set("orange");

        setTimeout(() => {
            this.fireBall = false;
            this.material.color.set("white");
        }, gameConfig.level.miniBall.firePowerUpTime);
    }

    die(death) {
        this.died = true;
        death(this);
    }

    move(hitter) {
        if (this.isRaycasterMode) {
            this.position.set(hitter.position.x, hitter.position.y + 1.31, hitter.position.z);
            return;
        }

        this.translateX(this.speed);
    }

    start() {
        this.died = false;
        this.speed = this.minSpeed;
        this.isRaycasterMode = false;
        this.increaseSpeedGradually();
    }

    raycasterMode() {
        this.resetPosition();
        this.speed = 0;
        this.isRaycasterMode = true;
    }

    update(hitter, walls, blocks, deathZones, hitBlock, death) {
        if (Game.paused || this.destroyed) return;

        this.move(hitter);

        this.collisionWithHitter(hitter);
        this.collisionWithWalls(walls);
        this.collisionWithBlocks(blocks, hitBlock);
        this.collisionWithDeathZones(deathZones, death);
    }

    destructor() {
        this.destroyed = true;
        this.geometry.dispose();
        this.material.dispose();
    }
}

export default MiniBall;
