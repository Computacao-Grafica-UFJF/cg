import * as THREE from "three";

export class MiniBall extends THREE.Mesh {
    constructor(x, y, z) {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshPhongMaterial({ color: "#fff" });

        super(geometry, material);

        this.translateX(x);
        this.translateY(y - 2);
        this.translateZ(z);

        this.speed = 0.3;
        this.radius = 0.5;
        this.evadeTime = 10;

        this.angle = this.getRandomAngleToDown();
        this.angle = Math.PI / 2;
        this.evadeMode = false;

        this.rotateZ(this.angle);
    }

    getRandomAngleToDown = () => {
        const min = 10;
        const max = 170;

        const randomAngle = Math.random() * (max - min) + min + 180;

        return THREE.MathUtils.degToRad(randomAngle);
    };

    collisionWithHitter = (hitter) => {
        const ballBoundingBox = new THREE.Box3().setFromObject(this);
        const hitterBoundingBox = new THREE.Box3().setFromObject(hitter);

        if (ballBoundingBox.intersectsBox(hitterBoundingBox)) {
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

    getAngleInQuadrant(angle) {
        while (angle > Math.PI) {
            angle -= Math.PI;
        }

        return angle;
    }

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

    checkCollisions(block) {
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
                this.checkCollisions(block);

                this.activateEvadeMode();

                destroyBlock(block);

                return;
            }
        });
    };

    collisionWithDeathZones(deathZones) {
        const ballBoundingBox = new THREE.Box3().setFromObject(this);

        deathZones.forEach((deathZone) => {
            const wallBoundingBox = new THREE.Box3().setFromObject(deathZone);

            if (ballBoundingBox.intersectsBox(wallBoundingBox)) {
                this.speed = 0;
            }
        });
    }

    move() {
        this.translateX(this.speed);
    }

    update(hitter, walls, blocks, deathZones, destroyBlock) {
        this.move();

        this.collisionWithHitter(hitter);
        this.collisionWithWalls(walls);
        this.collisionWithBlocks(blocks, destroyBlock);
        this.collisionWithDeathZones(deathZones);
    }
}

export default MiniBall;
