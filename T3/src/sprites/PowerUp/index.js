import * as THREE from "three";
import gameConfig from "../../config/Game.js";
import Game from "../../lib/Game/index.js";

class PowerUp extends THREE.Mesh {
    constructor(x, y, z, destroy, actionFunction, color) {
        const geometry = new THREE.CapsuleGeometry(0.3, 0.5, 16);
        const material = new THREE.MeshLambertMaterial({ color });

        super(geometry, material);

        this.speed = 0.1;
        this.destroy = destroy;
        this.actionFunction = actionFunction;

        this.castShadow = true;

        this.translateX(x);
        this.translateY(y);
        this.translateZ(z);
        this.rotateZ(THREE.MathUtils.degToRad(90));
    }

    move(hitter) {
        if (Game.paused) return;

        this.translateX(-this.speed);

        this.checkCollisionWithHitter(hitter);

        this.checkCollisionWithEndGame();
    }

    checkCollisionWithHitter = (hitter) => {
        const ballBoundingBox = new THREE.Box3().setFromObject(this);
        const hitterBoundingBox = new THREE.Box3().setFromObject(hitter);

        if (ballBoundingBox.intersectsBox(hitterBoundingBox) && this.speed > 0) {
            this.destroy(true);
            this.destructor();
        }
    };

    checkCollisionWithEndGame = () => {
        if (this.position.y < -gameConfig.level.width) {
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
