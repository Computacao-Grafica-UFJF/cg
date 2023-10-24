import * as THREE from "three";
import AngleHandler from "../../utils/AngleHandler/index.js";
import Game from "../../lib/Game/index.js";
import Logs from "../../utils/Logs/index.js";

export class MiniBall extends THREE.Mesh {
    constructor(x, y, z, color, startSpeed = 0, startAngle = 0) {
        const geometry = new THREE.SphereGeometry(0.2, 32, 32);
        const material = new THREE.MeshLambertMaterial({ color });

        super(geometry, material);

        this.died = false;
        this.destroyed = false;
        this.isRaycasterMode = startSpeed === 0 ? true : false;
        this.minSpeed = 0.1;
        this.maxSpeed = 0.1;
        this.speed = startSpeed || this.minSpeed;
        this.radius = 0.5;
        this.evadeTimeHitter = 100;

        this.evadeModeHitter = false;

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

            if (this.speed < this.maxSpeed - increment) {
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

    checkCollisionWithTopHitter(hitter) {
        const ballLeft = this.position.x - this.radius;
        const ballRight = this.position.x + this.radius;
        const ballTop = this.position.y + this.radius;
        const ballBottom = this.position.y - this.radius;

        const hitterLeft = hitter.position.x - hitter.width / 2;
        const hitterRight = hitter.position.x + hitter.width / 2;
        const hitterTop = hitter.position.y + hitter.height / 2;
        const hitterBottom = hitter.position.y - hitter.height / 2;

        const leftCollisionDistance = Math.abs(ballLeft - hitterRight);
        const rightCollisionDistance = Math.abs(ballRight - hitterLeft);
        const topCollisionDistance = Math.abs(ballTop - hitterBottom);
        const bottomCollisionDistance = Math.abs(ballBottom - hitterTop);

        const minCollisionDistance = Math.min(leftCollisionDistance, rightCollisionDistance, topCollisionDistance, bottomCollisionDistance);

        if (minCollisionDistance === bottomCollisionDistance) {
            return true;
        }

        return false;
    }

    rotate(angle) {
        this.angle = angle;
        this.rotation.set(0, 0, this.angle);
    }

    activateEvadeModeHitter() {
        this.evadeModeHitter = true;
        setTimeout(() => (this.evadeModeHitter = false), this.evadeTimeHitter);
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
            this.activateEvadeModeHitter();
            const centerHitter = hitter.position;

            const axis = new THREE.Vector3(1, 0, 0);
            const normal = new THREE.Vector3();
            normal.subVectors(this.position, centerHitter);

            const angleNormal = normal.angleTo(axis);

            const angle = hitter.getKickBallAngle(this.angle, angleNormal);

            // console.log("Angulo de entrada: ", THREE.MathUtils.radToDeg(this.angle - Math.PI));
            // console.log("Angulo da normal: ", THREE.MathUtils.radToDeg(angleNormal));
            // console.log("Angulo de saída: ", THREE.MathUtils.radToDeg(angle));

            this.rotate(angle);
        }
    };

    collisionWithWalls = (walls) => {
        const ballBoundingBox = new THREE.Box3().setFromObject(this);

        walls.forEach((wall) => {
            const wallBoundingBox = new THREE.Box3().setFromObject(wall);

            if (ballBoundingBox.intersectsBox(wallBoundingBox)) {
                const newAngle = wall.type === "horizontal" ? -this.angle : Math.PI - this.angle;
                this.rotate(newAngle);
                return;
            }
        });
    };

    invertAngleHorizontally(angle) {
        const oldAngle = angle;
        this.angle = AngleHandler.invertAngleHorizontally(angle);

        if (oldAngle === angle) {
            this.angle = -angle;
        }

        this.rotate(this.angle);
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

    checkCollisionType(centerBall, blockBoundingBox, angle) {
        console.log(this.radius);
        console.log("CX: ", centerBall.x, centerBall.y);
        console.log("CX + R: ", centerBall.x + this.radius, centerBall.y + this.radius);
        console.log("CX - R: ", centerBall.x - this.radius, centerBall.y - this.radius);
        console.log("BMAX: ", blockBoundingBox.max.x, blockBoundingBox.max.y);
        console.log("BMIn: ", blockBoundingBox.min.x, blockBoundingBox.min.y);

        const dist = (p1, p2) => {
            return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
        };

        if (
            centerBall.x <= blockBoundingBox.max.x &&
            centerBall.x >= blockBoundingBox.min.x &&
            centerBall.y - this.radius <= blockBoundingBox.max.y &&
            centerBall.y + this.radius >= blockBoundingBox.min.y
        ) {
            console.log("Horizontal");
            this.invertAngleVertically(angle);
        }

        if (
            centerBall.y <= blockBoundingBox.max.y &&
            centerBall.y >= blockBoundingBox.min.y &&
            centerBall.x - this.radius <= blockBoundingBox.max.x &&
            centerBall.x + this.radius >= blockBoundingBox.min.x
        ) {
            console.log("Vertical");
            this.invertAngleHorizontally(angle);
        }

        // const minSup = blockBoundingBox.min;
        // minSup.y = blockBoundingBox.max.y;

        // const maxInf = blockBoundingBox.max;
        // maxInf.x = blockBoundingBox.min.x;

        // if (
        //     dist(centerBall, minSup) <= this.radius &&
        //     centerBall.x + this.radius >= blockBoundingBox.minSup.x &&
        //     centerBall.y - this.radius <= blockBoundingBox.minSup.y
        // ) {
        //     console.log("R 5");
        // }

        // if (
        //     dist(centerBall, blockBoundingBox.min) <= this.radius &&
        //     centerBall.x + this.radius >= blockBoundingBox.min.x &&
        //     centerBall.y + this.radius >= blockBoundingBox.min.y
        // ) {
        //     console.log("R 7");
        // }

        // if (
        //     dist(centerBall, blockBoundingBox.max) <= this.radius &&
        //     centerBall.x - this.radius <= blockBoundingBox.max.x &&
        //     centerBall.y - this.radius <= blockBoundingBox.max.y
        // ) {
        //     console.log("R 6");
        // }

        // if (
        //     dist(centerBall, maxInf) <= this.radius &&
        //     centerBall.x - this.radius <= blockBoundingBox.maxInf.x &&
        //     centerBall.y + this.radius >= blockBoundingBox.maxInf.y
        // ) {
        //     console.log("R 8");
        // }
    }

    collisionWithBlocks = (blocks, hitBlock) => {
        const getBallBoundingBox = () => {
            const sphereCenter = this.position;
            const min = new THREE.Vector3(sphereCenter.x - this.radius, sphereCenter.y - this.radius, sphereCenter.z - this.radius);
            const max = new THREE.Vector3(sphereCenter.x + this.radius, sphereCenter.y + this.radius, sphereCenter.z + this.radius);
            const ballBoundingBox = new THREE.Box3(min, max);
            return ballBoundingBox;
        };
        const ballBoundingBox = getBallBoundingBox();
        const currentAngle = this.angle;

        blocks.find((block) => {
            const blockBoundingBox = new THREE.Box3().setFromObject(block);
            if (ballBoundingBox.intersectsBox(blockBoundingBox)) {
                // this.changeAngleByBlock(block, currentAngle);

                this.checkCollisionType(this.position, blockBoundingBox, currentAngle);

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

    die(death) {
        this.died = true;
        death(this);
    }

    move(hitter) {
        if (this.isRaycasterMode) {
            this.position.set(hitter.position.x, hitter.position.y + 1.25, hitter.position.z);
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
