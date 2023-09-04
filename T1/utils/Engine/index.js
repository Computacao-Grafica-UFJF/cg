// ver com o professor erro de importação MIME

// import { onWindowResize } from "../../../libs/util/util";
import * as THREE from "three";

import Raycaster from "../Raycaster";

class Engine {
    constructor() {
        // this.camera = camera;
        // this.renderer = renderer;
        raycaster = new Raycaster();
    }

    // startListeners = (camera, renderer) => {
    //     window.addEventListener(
    //         "resize",
    //         () => {
    //             onWindowResize(camera, renderer, 40);
    //         },
    //         false
    //     );
    //     window.addEventListener("mousemove", (event) => {
    //         this.raycaster.onMouseMove(event, this, camera);
    //     });
    // };
}

export default Engine;
