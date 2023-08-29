import * as THREE from "three";
import KeyboardState from "../../libs/util/KeyboardState.js";
import { TeapotGeometry } from "../../build/jsm/geometries/TeapotGeometry.js";
import { initRenderer, initDefaultSpotlight, createGroundPlaneXZ, SecondaryBox, onWindowResize, initCamera } from "../../libs/util/util.js";

const scene = new THREE.Scene();
const renderer = initRenderer();

initDefaultSpotlight(scene, new THREE.Vector3(5.0, 5.0, 5.0));
window.addEventListener(
    "resize",
    () => {
        onWindowResize(camera, renderer);
    },
    false
);

const keyboard = new KeyboardState();
let camera = initCamera(new THREE.Vector3(3.6, 4.6, 8.2));
const groundPlane = createGroundPlaneXZ(10, 10, 40, 40);
scene.add(groundPlane);

createTeapot(2.0, 0.4, 0.0, Math.random() * 0xffffff);
createTeapot(0.0, 0.4, 2.0, Math.random() * 0xffffff);
createTeapot(0.0, 0.4, -2.0, Math.random() * 0xffffff);

let camPos = new THREE.Vector3(3, 4, 8);
let camUp = new THREE.Vector3(0.0, 1.0, 0.0);
let camLook = new THREE.Vector3(0.1, 0.1, 0.1);
let message = new SecondaryBox("");

camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.copy(camPos);
camera.up.copy(camUp);
camera.lookAt(camLook);

render();

function updateCamera() {
    camera.position.copy(camPos);
    camera.lookAt(camLook);

    message.changeMessage(
        "Pos: {" + camPos.x + ", " + camPos.y + ", " + camPos.z + "} " + "/ LookAt: {" + camLook.x + ", " + camLook.y + ", " + camLook.z + "}"
    );
}

function moveCameraToLookAtZoom() {
    camPos = camera.position;
    camLook = camera.getWorldDirection(new THREE.Vector3());

    if (Math.abs(camPos.x - camLook.x) < 0.1 && Math.abs(camPos.z - camLook.z) < 0.1 && Math.abs(camPos.y - camLook.y) < 0.1) {
        return;
    }

    camPos.add({
        x: camPos.x < camLook.x ? 0 : camLook.x,
        y: camPos.y < camLook.y ? 0 : camLook.y,
        z: camPos.z < camLook.z ? 0 : camLook.z,
    });
}

function moveCameraToLookOpposite() {
    camPos = camera.position;
    camPos.sub(camLook);
}

function moveCameraLookAtToXPositive() {
    camLook.x += 1;
}

function moveCameraLookAtToXNegative() {
    camLook.x -= 1;
}

function moveCameraLookAtToZPositive() {
    camLook.z += 1;
}

function moveCameraLookAtToZNegative() {
    camLook.z -= 1;
}

function moveCameraLookAtToYPositive() {
    camLook.y += 1;
}

function moveCameraLookAtToYNegative() {
    camLook.y -= 1;
}

function keyboardUpdate() {
    keyboard.update();

    if (keyboard.pressed("pageup")) moveCameraToLookAtZoom();
    if (keyboard.pressed("pagedown")) moveCameraToLookOpposite();

    if (keyboard.pressed("left")) moveCameraLookAtToXNegative();
    if (keyboard.pressed("A")) moveCameraLookAtToXNegative();

    if (keyboard.pressed("right")) moveCameraLookAtToXPositive();
    if (keyboard.pressed("D")) moveCameraLookAtToXPositive();

    if (keyboard.pressed("up")) moveCameraLookAtToZPositive();
    if (keyboard.pressed("W")) moveCameraLookAtToZPositive();

    if (keyboard.pressed("down")) moveCameraLookAtToZNegative();
    if (keyboard.pressed("S")) moveCameraLookAtToZNegative();

    if (keyboard.pressed("Q")) moveCameraLookAtToYPositive();
    if (keyboard.pressed("E")) moveCameraLookAtToYNegative();

    updateCamera();
}

function createTeapot(x, y, z, color) {
    const geometry = new TeapotGeometry(0.5);
    const material = new THREE.MeshPhongMaterial({ color, shininess: "200" });
    material.side = THREE.DoubleSide;
    const obj = new THREE.Mesh(geometry, material);
    obj.castShadow = true;
    obj.position.set(x, y, z);
    scene.add(obj);
}

function render() {
    requestAnimationFrame(render);
    keyboardUpdate();
    renderer.render(scene, camera);
}
