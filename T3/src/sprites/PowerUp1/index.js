import * as THREE from "three";
import gameConfig from "../../config/Game.js";
import Game from "../../lib/Game/index.js";

class PowerUp1 extends THREE.Group {
    constructor(x, y, z, destroy) {
        function createCustomGeometry() {
            const v = [
                0, // p1
                0.3,
                0.3,
                0, // p2
                -0.3,
                0.3,
                0.2, // p3
                -0.3,
                0.22,
                0.2, // p4
                0.3,
                0.22,
            ];

            const f = [0, 1, 2, 0, 2, 3];
            const n = v;

            // Set buffer attributes
            var vertices = new Float32Array(v);
            var normals = new Float32Array(n);
            var indices = new Uint32Array(f);

            // Set the Buffer Geometry
            const geometry = new THREE.BufferGeometry();

            geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3)); // 3 components per vertex
            geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3)); // 3 components per normal
            geometry.setIndex(new THREE.BufferAttribute(indices, 1));
            geometry.computeVertexNormals();

            const material = new THREE.MeshPhongMaterial({ color: "rgb(255,0,0)" });
            material.side = THREE.DoubleSide; // Show front and back polygons
            material.flatShading = true;
            const mesh = new THREE.Mesh(geometry, material);

            setTexture(mesh);
            return mesh;
        }

        function setTexture(mesh) {
            const geometry = mesh.geometry;
            const material = mesh.material;

            var uvCoords = [
                0.0,
                0.0, // Canto superior esquerdo
                1.0,
                0.0, // Canto superior direito
                1.0,
                1.0, // Canto inferior direito
                0.0,
                1.0, // Canto inferior esquerdo
            ];

            geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvCoords), 2));

            // Load the texture and set to the material of the mesh
            const texture = new THREE.TextureLoader().load("./assets/texture/powerup/letterT.jpg");
            material.map = texture;
        }

        const geometry = new THREE.CapsuleGeometry(0.3, 0.5, 16);
        const material = new THREE.MeshLambertMaterial({ color: "#FF1D1D" });
        const capsule = new THREE.Mesh(geometry, material);

        const sprite = createCustomGeometry();

        super();
        this.add(sprite);
        this.add(capsule);

        this.speed = 0.1;
        this.destroy = destroy;

        this.castShadow = true;

        this.translateX(x);
        this.translateY(y);
        this.translateZ(z);
        this.rotateZ(THREE.MathUtils.degToRad(90));
        this.rotateY(THREE.MathUtils.degToRad(-25));
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
