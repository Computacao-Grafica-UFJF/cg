import * as THREE from "three";
import { OrbitControls } from "../../build/jsm/controls/OrbitControls.js";
import {
    initRenderer,
    initCamera,
    initDefaultBasicLight,
    setDefaultMaterial,
    InfoBox,
    onWindowResize,
    createGroundPlaneXZ,
} from "../../libs/util/util.js";
import { MathUtils } from "../../build/three.module.js";

const scene = new THREE.Scene();
const renderer = initRenderer();
const camera = initCamera(new THREE.Vector3(0, 15, 30));
const material = setDefaultMaterial();

initDefaultBasicLight(scene);
new OrbitControls(camera, renderer.domElement);

window.addEventListener(
    "resize",
    () => {
        onWindowResize(camera, renderer);
    },
    false
);

const axesHelper = new THREE.AxesHelper(12);
scene.add(axesHelper);

const plane = createGroundPlaneXZ(20, 20);
scene.add(plane);

const getSphere = () => {
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const sphere = new THREE.Mesh(sphereGeometry, material);

    return sphere;
};

const getSpheres = () => {
    const max = 12;
    const spheres = [];

    for (let i = 0; i < max; i++) {
        const sphere = getSphere();
        sphere.rotateY(((Math.PI * 2) / 12) * i);
        sphere.translateX(5);
        sphere.translateY(0.5);
        spheres.push(sphere);
    }

    return spheres;
};

const spheres = getSpheres();

scene.add(...spheres);

const controls = new InfoBox();

controls.add("Basic Scene");
controls.addParagraph();
controls.add("Use mouse to interact:");
controls.add("* Left button to rotate");
controls.add("* Right button to translate (pan)");
controls.add("* Scroll to zoom in/out.");
controls.show();

render();
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
