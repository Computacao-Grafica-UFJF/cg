import * as THREE from "three";
import Stats from "../../../../build/jsm/libs/stats.module.js";
import { initRenderer } from "../../../../libs/util/util.js";
import PerspectiveCameraWrapper from "../../utils/PerspectiveCameraWrapper/index.js";
import { OrbitControls } from "../../../../build/jsm/controls/OrbitControls.js";
import DirectionalLight from "../../utils/DirectionalLight/index.js";
import Session from "../Session/index.js";
import LiveCounter from "../../sprites/LiveCounter/index.js";
import Live from "../../sprites/LiveCounter/Live/index.js";
import Loader from "../../utils/Loader/index.js";
import Menu from "../../utils/Menu/index.js";

class Game {
    static scene = new THREE.Scene();
    static stats = new Stats();
    static renderer = initRenderer();
    static camera = new PerspectiveCameraWrapper();
    static paused = false;
    static movableCamera = true;
    static controls = new OrbitControls(this.camera, this.renderer.domElement);
    static session = new Session();

    static init() {
        this.initLight();
        this.fixCameraPosition();

        LiveCounter.update(this.session.lives);
        LiveCounter.getRenderLives().forEach((live) => this.scene.add(live));

        Loader.init();
    }

    static render(render) {
        requestAnimationFrame(render);
        this.stats.update();
        this.renderer.render(this.scene, this.camera);
    }

    static initLight() {
        const mainLight = new DirectionalLight();
        const ambientLight = new THREE.AmbientLight("#333");

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;

        this.scene.add(mainLight, ambientLight);
    }

    static fixCameraPosition() {
        this.movableCamera = !this.movableCamera;

        if (!this.movableCamera) {
            this.camera.resetToStartingPosition();
        }

        this.controls.enabled = this.movableCamera;
        this.controls.enableZoom = this.movableCamera;
    }

    static pause() {
        const insertPause = () => {
            if (this.paused) {
                this.controls.enabled = this.movableCamera;
                this.controls.enableZoom = this.movableCamera;

                return;
            }

            this.controls.enabled = false;
            this.controls.enableZoom = false;
        };

        insertPause();
        this.paused = !this.paused;
    }

    static changeLevel() {
        this.scene.children.forEach((child) => {
            if (child.destructor) child.destructor();
        });

        this.scene.remove(...this.scene.children);
        this.movableCamera = true;

        this.init();
    }

    static die = () => {
        const destroyLastLiveSprite = () => {
            const getLastLiveSprite = () => {
                const sprites = this.scene.children;

                for (let i = sprites.length - 1; i >= 0; i--) {
                    if (sprites[i] instanceof Live) {
                        return sprites[i];
                    }
                }

                return undefined;
            };

            const lastLiveSprite = getLastLiveSprite();
            if (lastLiveSprite) this.scene.remove(lastLiveSprite);
        };

        this.session.die();

        LiveCounter.update(this.session.lives);

        destroyLastLiveSprite();
    };

    static restart = () => {
        this.session.reset();
        LiveCounter.update(this.session.lives);
    };

    static gameOver() {
        this.scene.children.forEach((child) => {
            if (child.destructor) child.destructor();
        });

        this.scene.remove(...this.scene.children);
        this.movableCamera = true;

        Menu.showGameOverMenu();

        this.session.reset();
    }
}

export default Game;
