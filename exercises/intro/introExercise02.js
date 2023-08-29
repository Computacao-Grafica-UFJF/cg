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

const scene = new THREE.Scene(); // Create main scene
const renderer = initRenderer(); // Init a basic renderer
const camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
const materialCube = setDefaultMaterial("lightgreen"); // create a basic material
const materialCylinder = setDefaultMaterial("darkred");
const materialSphere = setDefaultMaterial("lightblue");
const light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
const orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.

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

const cube = new THREE.Mesh(cubeGeometry, materialCube);
const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 6, 32), materialCylinder);
const sphere = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), materialSphere);

cube.position.set(0.0, 2.0, 0.0);
cylinder.position.set(6.0, 3, 0);
sphere.position.set(-6.0, 2, 0);

scene.add(cube, cylinder, sphere);

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
