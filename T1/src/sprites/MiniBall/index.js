import * as THREE from "three";
import AngleHandler from "../../utils/AngleHandler/index.js";
import Game from "../../lib/Game/index.js";

export class MiniBall extends THREE.Mesh {
    constructor(x, y, z, color, startSpeed = 0) {
        const geometry = new THREE.SphereGeometry(0.2, 32, 32);
        const material = new THREE.MeshLambertMaterial({ color });

        super(geometry, material);

        this.isRaycasterMode = true;
        this.minSpeed = 0.2;
        this.maxSpeed = 0.6;
        this.speed = startSpeed;
        this.radius = 0.5;
        this.dead = false;

        this.castShadow = true;

        this.startX = x;
        this.startY = y;
        this.startZ = z;

        if (startSpeed) {
            this.increaseSpeedGradually();
            return;
        }

        this.resetPosition();
    }

    resetPosition() {
        this.position.set(this.startX, this.startY, this.startZ);
        this.angle = THREE.MathUtils.degToRad(90);
        this.rotation.set(0, 0, this.angle);
    }

    getRandomAngleToDown = () => {
        const min = 30;
        const max = 150;

        const randomAngle = Math.random() * (max - min) + min + 180;

        return THREE.MathUtils.degToRad(randomAngle);
    };

    increaseSpeedGradually() {
        const duration = 15000;
        const increment = ((this.maxSpeed - this.minSpeed) / duration) * 1000;

        const increase = () => {
            if (this.speed < this.maxSpeed) {
                if (!this.isRaycasterMode && !Game.paused) this.speed += increment;

                setTimeout(increase, 1000);
                return;
            }

            this.speed = this.maxSpeed;
        };

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

    collisionWithHitter = (hitter) => {
        const ballBoundingBox = new THREE.Box3().setFromObject(this);
        const hitterBoundingBox = new THREE.Box3().setFromObject(hitter);

        if (this.angle > 0 && this.angle < Math.PI) return;

        if (ballBoundingBox.intersectsBox(hitterBoundingBox) && this.checkCollisionWithTopHitter(hitter)) {
            const relativeX = this.position.x - hitter.position.x;
            const angle = hitter.getKickBallAngle(relativeX, this.angle);

            this.angle = angle;
            this.rotation.set(0, 0, angle);
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

    invertAngleHorizontally(angle) {
        const oldAngle = angle;
        this.angle = AngleHandler.invertAngleHorizontally(angle);

        if (oldAngle === angle) {
            this.angle = -angle;
        }

        this.rotation.set(0, 0, this.angle);
    }

    invertAngleVertically(angle) {
        this.angle = AngleHandler.invertAngleVertically(angle);
        this.rotation.set(0, 0, this.angle);
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
            if (ballBoundingBox.intersectsBox(blockBoundingBox)) {
                this.changeAngleByBlock(block, this.angle);
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
        this.dead = true;
        death();
    }

    move(hitter) {
        if (this.isRaycasterMode) {
            this.position.set(hitter.position.x + 0.8, hitter.position.y + 1, hitter.position.z);
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
        if (Game.paused) return;

        this.move(hitter);

        this.collisionWithHitter(hitter);
        this.collisionWithWalls(walls);
        this.collisionWithBlocks(blocks, hitBlock);
        this.collisionWithDeathZones(deathZones, death);
    }
}

export default MiniBall;
