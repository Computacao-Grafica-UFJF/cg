import * as THREE from "three";
import Stats from "../../../../build/jsm/libs/stats.module.js";
import { initRenderer } from "../../../../libs/util/util.js";
import PerspectiveCameraWrapper from "../../utils/PerspectiveCameraWrapper/index.js";
import { OrbitControls } from "../../../../build/jsm/controls/OrbitControls.js";
import Pause from "../../sprites/Pause/index.js";
import DirectionalLight from "../../utils/DirectionalLight/index.js";

class Game {
    static scene = new THREE.Scene();
    static stats = new Stats();
    static renderer = initRenderer();
    static camera = new PerspectiveCameraWrapper();
    static paused = false;

    static init() {
        this.initLight();
        this.fixCameraPosition();
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
        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.enabled = false;
        controls.enableZoom = false;
    }

    static pause() {
        this.paused ? this.scene.remove(...this.scene.children.filter((child) => child instanceof Pause)) : this.scene.add(new Pause());
        this.paused = !this.paused;
    }

    static changeLevel() {
        this.scene.remove(...this.scene.children);

        this.scene.children.forEach((child) => {
            if (child.destructor) child.destructor();
        });

        this.init();
    }
}

export default Game;
