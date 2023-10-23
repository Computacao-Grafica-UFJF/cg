import * as THREE from "three";
import gameConfig from "../../config/Game.js";
import Game from "../../lib/Game/index.js";

class PowerUp extends THREE.Mesh {
    constructor(x, y, z, destroy) {
        const geometry = new THREE.SphereGeometry(0.3, 32, 32);
        const material = new THREE.MeshLambertMaterial({ color: "yellow" });

        super(geometry, material);

        this.speed = 0.1;
        this.destroy = destroy;

        this.castShadow = true;

        this.translateX(x);
        this.translateY(y);
        this.translateZ(z);
    }

    move(hitter) {
        if (Game.paused) return;

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

    destructor() {
        this.speed = 0;
        this.geometry.dispose();
        this.material.dispose();
    }
}

export default PowerUp;
