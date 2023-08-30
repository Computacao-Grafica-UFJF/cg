import * as THREE from "three";
import Stats from "../../../build/jsm/libs/stats.module.js";
import { TrackballControls } from "../../../build/jsm/controls/TrackballControls.js";
import { initRenderer, onWindowResize, initDefaultBasicLight } from "../../../libs/util/util.js";
import Hitter from "../../sprites/Hitter/index.js";
import Block from "../../sprites/Block/index.js";
import OrthographicCameraWrapper from "../../utils/OrthographicCameraWrapper/index.js";
import Platform from "../../sprites/Platform/index.js";

const scene = new THREE.Scene();
const stats = new Stats();
const renderer = initRenderer();
const camera = new OrthographicCameraWrapper();
camera.disableZoom();
const trackballControls = new TrackballControls(camera, renderer.domElement);
initDefaultBasicLight(scene);

const buildLevel = () => {
    const buildPlatform = () => {
        const platform = new Platform(15, 30, 0x00ff00);
        return platform;
    };

    const buildHitter = () => {
        const hitter = new Hitter(0, -10, 0);
        hitter.dance();
        return hitter;
    };

    const buildBlocks = () => {
        const blocks = [];

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                blocks.push(new Block(i + i * 0.1 - 5, j + j * 0.1 + 5, 0).translateY(-1));
            }
        }

        return blocks;
    };

    const level = [buildPlatform(), buildHitter(), ...buildBlocks()];

    return level;
};

const level = buildLevel();
scene.add(...level);

window.addEventListener(
    "resize",
    () => {
        onWindowResize(camera, renderer);
    },
    false
);

const render = () => {
    stats.update();
    trackballControls.update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
};

export default render;
