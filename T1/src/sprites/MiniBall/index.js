import * as THREE from "three";
import AngleHandler from "../../utils/AngleHandler/index.js";
import Game from "../../lib/Game/index.js";

export class MiniBall extends THREE.Mesh {
    constructor(x, y, z, color) {
        const geometry = new THREE.SphereGeometry(0.2, 32, 32);
        const material = new THREE.MeshLambertMaterial({ color });

        super(geometry, material);

        this.isRaycasterMode = true;
        this.speed = 0;
        this.radius = 0.5;
        this.evadeTime = 10;

        this.castShadow = true;

        this.startX = x;
        this.startY = y;
        this.startZ = z;

        this.resetPosition();

        this.evadeMode = false;
    }

    resetPosition() {
        this.angle = THREE.MathUtils.degToRad(90);
        this.rotation.set(0, 0, this.angle);
    }

    getRandomAngleToDown = () => {
        const min = 10;
        const max = 170;

        const randomAngle = Math.random() * (max - min) + min + 180;

        return THREE.MathUtils.degToRad(randomAngle);
    };

    checkCollisionWithTopHitter(hitter) {
        const ballLeft = this.position.x - this.radius;
        const ballRight = this.position.x + this.radius;
        const ballTop = this.position.y + this.radius;
        const ballBottom = this.position.y - this.radius;

        const hitterLeft = hitter.position.x - hitter.width / 2;
        const hitterRight = hitter.position.x + hitter.width / 2;
        const hitterTop = hitter.position.y + hitter.height / 2;
        const hitterBottom = hitter.position.y - hitter.height / 2;

        const leftCollisionDistance = Math.abs(ballLeft - hitterRight);
        const rightCollisionDistance = Math.abs(ballRight - hitterLeft);
        const topCollisionDistance = Math.abs(ballTop - hitterBottom);
        const bottomCollisionDistance = Math.abs(ballBottom - hitterTop);

        const minCollisionDistance = Math.min(leftCollisionDistance, rightCollisionDistance, topCollisionDistance, bottomCollisionDistance);

        if (minCollisionDistance === bottomCollisionDistance) {
            return true;
        }

        return false;
    }

    getAngleToXAxis(normal) {
        const xAxis = new THREE.Vector3(1, 0, 0).normalize(); // Vetor representando o eixo x

        // Certifique-se de que os vetores são normalizados
        normal.normalize();

        // Calcula o ângulo entre a normal e o eixo x
        const angleToXAxis = normal.angleTo(xAxis);

        // // Verifica o sinal da componente z para determinar a orientação do ângulo
        // const crossProduct = new THREE.Vector3().crossVectors(normal, xAxis);
        // if (crossProduct.z < 0) {
        //     return -angleToXAxis; // Se a componente z do produto cruzado for negativa, inverte o sinal
        // } else {
        //     return angleToXAxis;
        // }

        return angleToXAxis;
    }

    collisionWithHitter = (hitter) => {
        const ballBoundingBox = new THREE.Box3().setFromObject(this);
        const hitterBoundingBox = new THREE.Box3().setFromObject(hitter);

        if (this.angle > 0 && this.angle < Math.PI) return;

        // if (ballBoundingBox.intersectsBox(hitterBoundingBox) && this.checkCollisionWithTopHitter(hitter)) {
        //     console.log("bateu");

        //     const relativeX = this.position.x - hitter.position.x;
        //     const angle = hitter.getKickBallAngle(relativeX, this.angle);

        //     this.angle = angle;
        //     this.rotation.set(0, 0, angle);
        // }

        // Atualizar a matriz do mundo para garantir que as posições estejam corretas
        this.position.copy(this.position);
        hitter.position.copy(hitter.position);
        this.updateMatrixWorld();
        hitter.updateMatrixWorld();

        // Criar um raio que parte da posição da bola na direção do hitter
        const directionVector = new THREE.Vector3().copy(hitter.position).sub(this.position).normalize();
        const ray = new THREE.Raycaster(this.position, directionVector, 0, 0.45);

        // Verificar se o raio intersecta a geometria do hitter
        const collisionResults = ray.intersectObject(hitter);

        if (collisionResults.length > 0) {
            const normalOfCollsion = hitter.getNormalCollision(this.position);
            const angleNormal = this.getAngleToXAxis(normalOfCollsion);

            console.log(angleNormal);

            // const relativeX = this.position.x - hitter.position.x;
            const angle = hitter.getKickBallAngle(angleNormal, this.angle);

            console.log(angle);

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

    invertAngleHorizontally() {
        this.angle = AngleHandler.invertAngleHorizontally(this.angle);
        this.rotation.set(0, 0, this.angle);
    }

    invertAngleVertically() {
        this.angle = AngleHandler.invertAngleVertically(this.angle);
        this.rotation.set(0, 0, this.angle);
    }

    activateEvadeMode() {
        this.evadeMode = true;
        setTimeout(() => (this.evadeMode = false), this.evadeTime);
    }

    checkCollisionsWithBlocks(block) {
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

    collisionWithBlocks = (blocks, hitBlock) => {
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
                this.checkCollisionsWithBlocks(block);
                this.activateEvadeMode();
                hitBlock(block);
                return 1;
            }
        });
    };

    collisionWithDeathZones(deathZones, death) {
        const ballBoundingBox = new THREE.Box3().setFromObject(this);
        deathZones.forEach((deathZone) => {
            const wallBoundingBox = new THREE.Box3().setFromObject(deathZone);
            if (ballBoundingBox.intersectsBox(wallBoundingBox)) {
                death();
            }
        });
    }

    move(hitter) {
        if (this.isRaycasterMode) {
            this.position.set(hitter.position.x, hitter.position.y + hitter.height + 0.3, hitter.position.z);
            return;
        }

        this.translateX(this.speed);
    }

    start() {
        this.speed = 0.3;
        this.isRaycasterMode = false;
    }

    raycasterMode() {
        this.resetPosition();
        this.speed = 0;
        this.isRaycasterMode = true;
    }

    update(hitter, walls, blocks, deathZones, hitBlock, death) {
        if (Game.paused) return;

        this.move(hitter);

        this.collisionWithHitter(hitter);
        this.collisionWithWalls(walls);
        this.collisionWithBlocks(blocks, hitBlock);
        this.collisionWithDeathZones(deathZones, death);
    }
}

export default MiniBall;
