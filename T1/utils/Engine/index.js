import * as THREE from "three";
import Raycaster from "../Raycaster/index.js";
import { onWindowResize } from "../../../libs/util/util.js";

class Engine {
    constructor(camera, renderer, scene) {
        this.camera = camera;
        this.renderer = renderer;
        this.scene = scene;

        this.raycaster = new Raycaster();
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
}

export default Engine;
