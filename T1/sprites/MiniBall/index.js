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
        this.angle = -Math.PI / 2;

        this.rotateZ(this.angle);
    }

    radToDeg = (rad) => {
        return rad * (180 / Math.PI);
    };

    update(hitter, walls, blocks, deathZones) {
        const collisionWithHitter = () => {
            const ballBoundingBox = new THREE.Box3().setFromObject(this);
            const hitterBoundingBox = new THREE.Box3().setFromObject(hitter);

            if (ballBoundingBox.intersectsBox(hitterBoundingBox)) {
                const relativeX = this.position.x - hitter.position.x;
                const angle = hitter.getKickBallAngle(relativeX);
                this.angle = angle;
                this.rotation.set(0, 0, angle);
            }
        };

        const collisionWithWalls = () => {
            const ballBoundingBox = new THREE.Box3().setFromObject(this);

            walls.forEach((wall) => {
                const wallBoundingBox = new THREE.Box3().setFromObject(wall);

                if (ballBoundingBox.intersectsBox(wallBoundingBox)) {
                    this.angle = wall.type === "horizontal" ? -this.angle : Math.PI - this.angle;
                    this.rotation.set(0, 0, this.angle);
                }
            });
        };

        const collisionWithDeathZones = () => {
            const ballBoundingBox = new THREE.Box3().setFromObject(this);

            deathZones.forEach((deathZone) => {
                const wallBoundingBox = new THREE.Box3().setFromObject(deathZone);

                if (ballBoundingBox.intersectsBox(wallBoundingBox)) {
                    this.speed = 0;
                }
            });
        };

        collisionWithHitter();
        collisionWithWalls();
        collisionWithDeathZones();
        this.translateX(this.speed);
    }
}

export default MiniBall;
