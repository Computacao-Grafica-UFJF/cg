import * as THREE from "three";

export class MiniBall extends THREE.Mesh {
    constructor(x, y, z, color) {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshPhongMaterial({ color });

        super(geometry, material);

        this.speed = 0;
        this.radius = 0.5;
        this.evadeTime = 10;

        this.x = x;
        this.y = y;
        this.z = z;

        this.startPosition(this.x, this.y, this.z);

        this.angle = -Math.PI / 2;
        this.evadeMode = false;

        this.rotateZ(this.angle);
    }

    startPosition(x, y, z) {
        this.translateX(x);
        this.translateY(y);
        this.translateZ(z);
    }

    getRandomAngleToDown = () => {
        const min = 10;
        const max = 170;

        const randomAngle = Math.random() * (max - min) + min + 180;

        return THREE.MathUtils.degToRad(randomAngle);
    };

    checkCollisionWithTopHitter(hitter) {
        const ballLeft = this.position.x - this.radius;
        const ballRight = this.position.x + this.radius;
        const ballTop = this.position.y + this.radius;
        const ballBottom = this.position.y - this.radius;

        const hitterLeft = hitter.position.x - hitter.geometry.parameters.width / 2;
        const hitterRight = hitter.position.x + hitter.geometry.parameters.width / 2;
        const hitterTop = hitter.position.y + hitter.geometry.parameters.height / 2;
        const hitterBottom = hitter.position.y - hitter.geometry.parameters.height / 2;

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

    invertAngleHorizontally() {
        this.angle = Math.PI - this.angle;
        this.rotation.set(0, 0, this.angle);
    }

    invertAngleVertically() {
        this.angle = 2 * Math.PI - this.angle;
        this.rotation.set(0, 0, this.angle);
    }

    activateEvadeMode() {
        this.evadeMode = true;
        setTimeout(() => (this.evadeMode = false), this.evadeTime);
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

    collisionWithBlocks = (blocks, destroyBlock) => {
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

            if (ballBoundingBox.intersectsBox(blockBoundingBox) && this.evadeMode === false) {
                this.checkCollisionsWithBlocks(block);

                this.activateEvadeMode();

                destroyBlock(block);

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

    resetPosition() {
        this.position.set(1, -12, 0);
    }

    move() {
        this.translateX(this.speed);
    }

    pause() {
        this.speed = this.speed === 0 ? 0.3 : 0;
    }

    update(hitter, walls, blocks, deathZones, destroyBlock, death) {
        this.move();

        this.collisionWithHitter(hitter);
        this.collisionWithWalls(walls);
        this.collisionWithBlocks(blocks, destroyBlock);
        this.collisionWithDeathZones(deathZones, death);
    }
}

export default MiniBall;
