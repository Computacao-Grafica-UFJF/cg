import * as THREE from "three";
import AngleHandler from "../../utils/AngleHandler/index.js";
import Game from "../../lib/Game/index.js";

export class MiniBall extends THREE.Mesh {
    constructor(x, y, z, color) {
        const geometry = new THREE.SphereGeometry(0.2, 32, 32);
        const material = new THREE.MeshLambertMaterial({ color });

        super(geometry, material);

        this.isRaycasterMode = true;
        this.speed = 0;
        this.radius = 0.5;
        this.evadeTime = 10;
        this.evadeTimeHitter = 100;

        this.castShadow = true;

        this.startX = x;
        this.startY = y;
        this.startZ = z;

        this.resetPosition();

        this.evadeModeBlock = false;
        this.evadeModeHitter = false;
    }

    resetPosition() {
        this.position.set(this.startX, this.startY, this.startZ);
        this.angle = THREE.MathUtils.degToRad(90);
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
            // console.log("Angulo de saida: ", THREE.MathUtils.radToDeg(angle));

            this.angle = angle;

            this.rotation.set(0, 0, angle);

            return 1;
        }
    };

    collisionWithWalls = (walls) => {
        const ballBoundingBox = new THREE.Box3().setFromObject(this);

        walls.forEach((wall) => {
            const wallBoundingBox = new THREE.Box3().setFromObject(wall);

            if (ballBoundingBox.intersectsBox(wallBoundingBox)) {
                this.angle = wall.type === "horizontal" ? -this.angle : Math.PI - this.angle;
                this.rotation.set(0, 0, this.angle);
                return;
            }
        });
    };

    invertAngleHorizontally() {
        this.angle = AngleHandler.invertAngleHorizontally(this.angle);
        this.rotation.set(0, 0, this.angle);
    }

    invertAngleVertically() {
        this.angle = AngleHandler.invertAngleVertically(this.angle);
        this.rotation.set(0, 0, this.angle);
    }

    activateEvadeModeBlock() {
        this.evadeModeBlock = true;
        setTimeout(() => (this.evadeModeBlock = false), this.evadeTime);
    }

    checkCollisionsWithBlocks(block) {
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
            this.invertAngleHorizontally();
            return;
        }

        this.invertAngleVertically();
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
        blocks.find((block) => {
            const blockBoundingBox = new THREE.Box3().setFromObject(block);
            if (ballBoundingBox.intersectsBox(blockBoundingBox) && this.evadeModeBlock === false) {
                this.checkCollisionsWithBlocks(block);
                this.activateEvadeModeBlock();
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
                death();
            }
        });
    }

    move(hitter) {
        if (this.isRaycasterMode) {
            this.position.set(hitter.position.x, hitter.position.y + 1.25, hitter.position.z);
            return;
        }

        this.translateX(this.speed);
    }

    start() {
        this.speed = 0.3;
        this.isRaycasterMode = false;
    }

    raycasterMode() {
        this.resetPosition();
        this.speed = 0;
        this.isRaycasterMode = true;
    }

    update(hitter, walls, blocks, deathZones, hitBlock, death) {
        if (Game.paused) return;

        this.move(hitter);

        this.collisionWithHitter(hitter);
        this.collisionWithWalls(walls);
        this.collisionWithBlocks(blocks, hitBlock);
        this.collisionWithDeathZones(deathZones, death);
    }
}

export default MiniBall;
