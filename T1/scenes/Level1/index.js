import * as THREE from "three";
import Stats from "../../../build/jsm/libs/stats.module.js";
import { TrackballControls } from "../../../build/jsm/controls/TrackballControls.js";
import { initRenderer, initCamera, onWindowResize, initDefaultBasicLight } from "../../../libs/util/util.js";
import Hitter from "../../sprites/Hitter/index.js";
import Block from "../../sprites/Block/index.js";

const scene = new THREE.Scene();
const stats = new Stats();
const renderer = initRenderer();
const camera = initCamera(new THREE.Vector3(1, 0, 0));
const trackballControls = new TrackballControls(camera, renderer.domElement);
initDefaultBasicLight(scene);

const buildLevel = () => {
    const level = [];

    level.push(new Hitter(0, 0, 0));

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            level.push(new Block(0, i + i * 0.1 + 5, j + j * 0.1 - 5));
        }
    }

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
