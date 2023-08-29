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

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene(); // Create main scene
renderer = initRenderer(); // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
material = setDefaultMaterial("orange"); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.

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

const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);

for (let verticalIndex = 0; verticalIndex < 3; verticalIndex++) {
    for (let horizontalIndex = 0; horizontalIndex < 3; horizontalIndex++) {
        const cube = new THREE.Mesh(cubeGeometry, material);

        const x = horizontalIndex * 8 - 8;
        const z = verticalIndex * 8 - 8;

        cube.position.set(x, 2.0, z);
        scene.add(cube);
    }
}

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
