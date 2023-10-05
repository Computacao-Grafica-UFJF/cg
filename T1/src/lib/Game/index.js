import * as THREE from "three";
import Stats from "../../../../build/jsm/libs/stats.module.js";
import { initRenderer, initDefaultBasicLight } from "../../../../libs/util/util.js";
import PerspectiveCameraWrapper from "../../utils/PerspectiveCameraWrapper/index.js";
import { OrbitControls } from "../../../../build/jsm/controls/OrbitControls.js";
import KeyboardCommands from "../../utils/KeyboardCommands/index.js";
import Pause from "../../sprites/Pause/index.js";
import DirectionalLight from "../../utils/DirectionalLight/index.js";

class Game {
    static scene = new THREE.Scene();
    static stats = new Stats();
    static renderer = initRenderer();
    static camera = new PerspectiveCameraWrapper();
    static keyboardCommands = new KeyboardCommands();
    static paused = false;
    static level = null;

    static init() {
        this.initLight();
        this.fixCameraPosition();
    }

    static render(render) {
        this.level.moveMiniBall();
        requestAnimationFrame(render);
        this.stats.update();
        this.renderer.render(this.scene, this.camera);
    }

    static initLight() {
        const mainLight = new DirectionalLight(4, 3, 6);
        this.scene.add(mainLight);
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

    static keyboardUpdate = (level) => {
        const keyboard = this.keyboardCommands.keyboardState;
        keyboard.update();
        this.keyboardCommands.listenCommands(level);
    };
}

export default Game;
