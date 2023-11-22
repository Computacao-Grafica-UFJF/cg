import * as THREE from "three";
import gameConfig from "../../config/Game.js";
import Game from "../../lib/Game/index.js";

class PowerUp1 extends THREE.Mesh {
    constructor(x, y, z, destroy) {
        const geometry = new THREE.CapsuleGeometry(0.3, 0.5, 16);
        const material = new THREE.MeshLambertMaterial({ color: "red" });

        super(geometry, material);

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

    calcularBallBoundingBox(group) {
        let esferaEnvolvedora = new THREE.Sphere();
        group.traverse((objeto) => {
            if (objeto.isMesh) {
                // Atualize a esfera envolvente com base na posição e escala do objeto
                objeto.geometry.computeBoundingSphere();
                esferaEnvolvedora.union(objeto.geometry.boundingSphere.clone().applyMatrix4(objeto.matrixWorld));
            }
        });

        // Crie a caixa delimitadora esférica usando a esfera envolvente
        let ballBoundingBox = new THREE.Box3().setFromObject(
            new THREE.Mesh(new THREE.SphereGeometry(esferaEnvolvedora.radius), new THREE.MeshBasicMaterial())
        );

        return ballBoundingBox;
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
