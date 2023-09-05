import * as THREE from "three";
import Raycaster from "../Raycaster/index.js";
import { onWindowResize } from "../../../libs/util/util.js";
import KeyboardCommands from "../KeyboardCommands/index.js";

class Engine {
    constructor(camera, renderer, scene) {
        this.camera = camera;
        this.renderer = renderer;
        this.scene = scene;

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

    keyboardUpdate = (level) => {
        const keyboard = this.keyboardCommands.keyboardState;
        keyboard.update();

        if (keyboard.down("R")) level.restart();
        if (keyboard.down("space")) console.log("space");
        if (keyboard.down("enter")) this.keyboardCommands.fullScreenControl.toggleFullScreen();
    };
}

export default Engine;
