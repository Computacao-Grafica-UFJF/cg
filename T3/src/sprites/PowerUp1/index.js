import * as THREE from "three";
import gameConfig from "../../config/Game.js";
import Game from "../../lib/Game/index.js";

class PowerUp1 extends THREE.Mesh {
    constructor(x, y, z, destroy) {
        // const canvas = document.createElement("canvas");
        // const context = canvas.getContext("2d");
        // canvas.width = 512;
        // canvas.height = 256;
        // context.fillStyle = "red";
        // context.font = "72px Arial";
        // context.fillText("T", 120, 150);
        // const texture = new THREE.CanvasTexture(canvas);

        const geometry = new THREE.CapsuleGeometry(0.3, 0.5, 16);
        const material = new THREE.MeshLambertMaterial({ color: "red" });

        super(geometry, material);

        this.castShadow = true;

        this.speed = 0.1;
        this.destroy = destroy;

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

export default PowerUp1;
