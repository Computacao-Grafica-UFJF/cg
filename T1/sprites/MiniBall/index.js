import * as THREE from "three";

export class MiniBall extends THREE.Mesh {
    constructor(x, y, z) {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshPhongMaterial({ color: "#fff", shininess: 200 });

        super(geometry, material);

        this.translateX(x);
        this.translateY(y);
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
            const angle = hitter.getKickBallAngle(relativeX);
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

    update(hitter, walls, blocks, deathZones) {
        this.collisionWithHitter(hitter);
        this.collisionWithWalls(walls);
        this.collisionWithDeathZones(deathZones);
        this.translateX(this.speed);
    }
}

export default MiniBall;
