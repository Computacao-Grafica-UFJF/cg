import * as THREE from "three";
import Stats from "../../../../build/jsm/libs/stats.module.js";
import { initRenderer, initDefaultBasicLight } from "../../../../libs/util/util.js";
import PerspectiveCameraWrapper from "../../utils/PerspectiveCameraWrapper/index.js";
import { OrbitControls } from "../../../../build/jsm/controls/OrbitControls.js";

class Game {
    static scene = new THREE.Scene();
    static stats = new Stats();
    static renderer = initRenderer();
    static camera = new PerspectiveCameraWrapper();

    static init() {
        initDefaultBasicLight(this.scene, true, new THREE.Vector3(8, 0, 8));
        this.fixCameraPosition();
    }

    static render() {
        this.stats.update();
        this.renderer.render(this.scene, this.camera);
    }

    static fixCameraPosition() {
        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.enabled = false;
        controls.enableZoom = false;
    }
}

export default Game;
