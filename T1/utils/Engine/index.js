import * as THREE from "three";
import Raycaster from "../Raycaster/index.js";
import { onWindowResize } from "../../../libs/util/util.js";
import KeyboardCommands from "../KeyboardCommands/index.js";

class Engine {
    constructor(camera, renderer, scene) {
        this.camera = camera;
        this.renderer = renderer;
        this.scene = scene;
        this.paused = false;
        this.finished = false;

        this.raycaster = new Raycaster();
        this.keyboardCommands = new KeyboardCommands();
        this.startListeners(camera, renderer);
    }

    startListeners = (camera, renderer) => {
        window.addEventListener(
            "resize",
            () => {
                onWindowResize(camera, renderer, 40);
            },
            false
        );
        window.addEventListener("mousemove", (event) => {
            this.raycaster.onMouseMove(event, this, camera);
        });
    };

    restart() {
        this.scene.remove(...this.getElements());
        this.start();
    }

    finish() {
        this.pause();

        this.finished = true;
    }

    pause() {
        if (this.finished) return;

        this.paused = !this.paused;

        if (this.miniBall) this.miniBall.pause();
    }

    keyboardUpdate = (level) => {
        const keyboard = this.keyboardCommands.keyboardState;
        keyboard.update();
        this.keyboardCommands.listenCommands(level);
    };
}

export default Engine;
