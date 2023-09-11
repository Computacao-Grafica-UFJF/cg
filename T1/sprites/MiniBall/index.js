import * as THREE from "three";

export class MiniBall extends THREE.Mesh {
    constructor(x, y, z) {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshPhongMaterial({ color: "#fff" });

        super(geometry, material);

        this.translateX(x);
        this.translateY(y - 2);
        this.translateZ(z);

        // this.speed = 0.03;
        this.speed = 0.1;
        // this.angle = Math.PI - Math.PI / 3.3;
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
        return Math.PI + angle;
    }

    invertVertically(angle) {
        return 2 * Math.PI - angle;
    }

    verifyIfHorizontalCollision(relativePosition) {
        return Math.abs(relativePosition.x) > Math.abs(relativePosition.y);
    }

    collisionWithBlocks = (blocks, destroyBlock) => {
        // const ballBoundingBox1 = new THREE.Box3().setFromObject(this);

        const sphereCenter = this.position;
        const sphereRadius = 0.5;

        const min = new THREE.Vector3(sphereCenter.x - sphereRadius, sphereCenter.y - sphereRadius, sphereCenter.z - sphereRadius);
        const max = new THREE.Vector3(sphereCenter.x + sphereRadius, sphereCenter.y + sphereRadius, sphereCenter.z + sphereRadius);
        const ballBoundingBox = new THREE.Box3(min, max);

        // TODO: Conserte a colisão

        blocks.find((block) => {
            const blockBoundingBox = new THREE.Box3().setFromObject(block);

            if (ballBoundingBox.intersectsBox(blockBoundingBox)) {
                const ballCenter = new THREE.Vector3();
                ballBoundingBox.getCenter(ballCenter);

                const blockCenter = new THREE.Vector3();
                blockBoundingBox.getCenter(blockCenter);

                const relativePosition = ballCenter.clone().sub(blockCenter);

                // console.log("Ball Center: ", ballCenter);
                // console.log("Block Center: ", blockCenter);
                // console.log(relativePosition.x, " ", relativePosition.y);
                // console.log(ballBoundingBox, " ");

                // // console.log(this.angle);

                // if (Math.abs(relativePosition.x) > Math.sqrt(0.5) && Math.abs(relativePosition.y) > Math.sqrt(0.5)) {
                //     console.log("a");
                //     return;
                // }

                console.log(relativePosition);
                this.verifyIfHorizontalCollision(relativePosition)
                    ? (this.angle = this.invertHorizontally(this.angle))
                    : (this.angle = this.invertVertically(this.angle));

                this.rotation.set(0, 0, this.angle);
                // console.log(ballBoundingBox1);

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

const miniBall = new MiniBall(1, 1, 1);

miniBall.invertVertically();
