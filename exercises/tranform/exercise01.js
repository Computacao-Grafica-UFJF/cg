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

const getCover = () => {
    const cubeGeometry = new THREE.BoxGeometry(11, 0.3, 6);
    const cube = new THREE.Mesh(cubeGeometry, material);

    return cube;
};

const getFoot = () => {
    const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3, 32), material);
    cylinder.position.set(3, 0, 0);

    return cylinder;
};

const getFeet = () => {
    const coverWidth = 6 / 2 - 0.5;
    const coverLength = 11 / 2 - 0.5;

    const foot1 = getFoot();
    foot1.position.set(coverLength, 1.5, coverWidth);

    const foot2 = getFoot();
    foot2.position.set(-coverLength, 1.5, coverWidth);

    const foot3 = getFoot();
    foot3.position.set(coverLength, 1.5, -coverWidth);

    const foot4 = getFoot();
    foot4.position.set(-coverLength, 1.5, -coverWidth);

    return [foot1, foot2, foot3, foot4];
};

const cover = getCover();
cover.position.set(0.0, 3.0, 0.0);

const feet = getFeet();

scene.add(cover, ...feet);

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
