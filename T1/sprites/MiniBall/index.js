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
        this.angle = this.getRandomAngleToDown();

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

    invertHorizontally(angle) {
        return Math.PI - angle;
    }

    invertVertically(angle) {
        return 2 * Math.PI - angle;
    }

    collisionWithBlocks = (blocks, destroyBlock) => {
        const ballBoundingBox = new THREE.Box3().setFromObject(this);

        blocks.forEach((block) => {
            const blockBoundingBox = new THREE.Box3().setFromObject(block);

            if (ballBoundingBox.intersectsBox(blockBoundingBox)) {
                const ballCenter = new THREE.Vector3();
                ballBoundingBox.getCenter(ballCenter);

                const blockCenter = new THREE.Vector3();
                blockBoundingBox.getCenter(blockCenter);

                const relativePosition = ballCenter.clone().sub(blockCenter);

                Math.abs(relativePosition.x) > Math.abs(relativePosition.y)
                    ? (this.angle = this.invertHorizontally(this.angle))
                    : (this.angle = this.invertVertically(this.angle));

                this.rotation.set(0, 0, this.angle);

                destroyBlock(block);
                return;
            }
        });
    };

    collisionWithDeathZones = (deathZones) => {
        const ballBoundingBox = new THREE.Box3().setFromObject(this);

        deathZones.forEach((deathZone) => {
            const wallBoundingBox = new THREE.Box3().setFromObject(deathZone);

            if (ballBoundingBox.intersectsBox(wallBoundingBox)) {
                this.speed = 0;
            }
        });
    };

    update(hitter, walls, blocks, deathZones, destroyBlock) {
        this.collisionWithHitter(hitter);
        this.collisionWithWalls(walls);
        this.collisionWithBlocks(blocks, destroyBlock);
        this.collisionWithDeathZones(deathZones);
        this.translateX(this.speed);
    }
}

export default MiniBall;

const miniBall = new MiniBall(1, 1, 1);

miniBall.invertVertically();
