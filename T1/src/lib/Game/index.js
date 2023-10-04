import * as THREE from "three";
import Stats from "../../../../build/jsm/libs/stats.module.js";
import { initRenderer, initDefaultBasicLight } from "../../../../libs/util/util.js";
import PerspectiveCameraWrapper from "../../utils/PerspectiveCameraWrapper/index.js";
import { OrbitControls } from "../../../../build/jsm/controls/OrbitControls.js";
import KeyboardCommands from "../../utils/KeyboardCommands/index.js";
import Pause from "../../sprites/Pause/index.js";

class Game {
    static scene = new THREE.Scene();
    static stats = new Stats();
    static renderer = initRenderer();
    static camera = new PerspectiveCameraWrapper();
    static keyboardCommands = new KeyboardCommands();
    static paused = false;

    static init() {
        initDefaultBasicLight(this.scene, true, new THREE.Vector3(8, 0, 8));
        this.fixCameraPosition();
    }

    static render(render) {
        requestAnimationFrame(render);
        this.stats.update();
        this.renderer.render(this.scene, this.camera);
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
