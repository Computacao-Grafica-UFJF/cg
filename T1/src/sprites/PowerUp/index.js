import * as THREE from "three";
import gameConfig from "../../config/Game.js";

class PowerUp extends THREE.Mesh {
    constructor(x, y, z, destroy) {
        const geometry = new THREE.SphereGeometry(0.2, 32, 32);
        const material = new THREE.MeshLambertMaterial({ color: "yellow" });

        super(geometry, material);

        this.speed = 0.2;
        this.radius = 0.5;
        this.dead = false;
        this.destroy = destroy;

        this.castShadow = true;

        this.translateX(x);
        this.translateY(y);
        this.translateZ(z);
    }

    move(hitter) {
        this.translateY(-this.speed);

        this.checkCollisionWithHitter(hitter);

        this.checkCollisionWithEndGame();
    }

    checkCollisionWithHitter = (hitter) => {
        const ballBoundingBox = new THREE.Box3().setFromObject(this);
        const hitterBoundingBox = new THREE.Box3().setFromObject(hitter);

        if (ballBoundingBox.intersectsBox(hitterBoundingBox)) {
            this.destroy(true);
        }
    };

    checkCollisionWithEndGame = () => {
        if (this.position.y < -gameConfig.width) {
            this.destroy(false);
        }
    };
}

export default PowerUp;
