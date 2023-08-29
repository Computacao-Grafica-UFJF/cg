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

let camPos = new THREE.Vector3(0, 0, 0);
let camUp = new THREE.Vector3(0.0, 1.0, 0.0);
let camLook = new THREE.Vector3(0.0, 0.0, 0.0);
let message = new SecondaryBox("");

camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.copy(camPos);
camera.up.copy(camUp);
camera.lookAt(camLook);

let cameraHolder = new THREE.Object3D();
cameraHolder.add(camera);
scene.add(cameraHolder);

render();

function updateCamera() {
    camPos = camera.position;
    camLook = camera.getWorldDirection(new THREE.Vector3());

    message.changeMessage(
        "Pos: {" + camPos.x + ", " + camPos.y + ", " + camPos.z + "} " + "/ LookAt: {" + camLook.x + ", " + camLook.y + ", " + camLook.z + "}"
    );
}

function moveCameraToLookAt() {
    camPos = camera.position;
    camLook = camera.getWorldDirection(new THREE.Vector3());

    if (camPos.x <= camLook.x && camPos.z <= camLook.z && camPos.y <= camLook.y) {
        return;
    }

    camPos.add(camLook);
}

function moveCameraToLookOpposite() {
    camPos = camera.position;
    camLook = camera.getWorldDirection(new THREE.Vector3());

    camPos.sub(camLook);
}

function moveCameraLookAtToXPositive() {
    cameraHolder.translateX(0.1);
}

function moveCameraLookAtToXNegative() {
    cameraHolder.translateX(-0.1);
}

function moveCameraLookAtToYPositive() {
    cameraHolder.translateY(0.1);
}

function moveCameraLookAtToYNegative() {
    cameraHolder.translateY(-0.1);
}

function moveCameraLookAtToZPositive() {
    cameraHolder.translateZ(0.1);
}

function moveCameraLookAtToZNegative() {
    cameraHolder.translateZ(-0.1);
}

function rotateCameraLookAtToXPositive() {
    cameraHolder.rotateX(0.1);
}

function rotateCameraLookAtToXNegative() {
    cameraHolder.rotateX(-0.1);
}

function rotateCameraLookAtToYPositive() {
    cameraHolder.rotateY(0.1);
}

function rotateCameraLookAtToYNegative() {
    cameraHolder.rotateY(-0.1);
}

function rotateCameraLookAtToZPositive() {
    cameraHolder.rotateZ(0.1);
}

function rotateCameraLookAtToZNegative() {
    cameraHolder.rotateZ(-0.1);
}

function keyboardUpdate() {
    keyboard.update();

    if (keyboard.pressed("pageup")) moveCameraToLookAt();
    if (keyboard.pressed("pagedown")) moveCameraToLookOpposite();

    if (keyboard.pressed("B")) moveCameraLookAtToZPositive();
    if (keyboard.pressed("space")) moveCameraLookAtToZNegative();

    if (keyboard.pressed("W")) moveCameraLookAtToYPositive();
    if (keyboard.pressed("S")) moveCameraLookAtToYNegative();

    if (keyboard.pressed("A")) moveCameraLookAtToXPositive();
    if (keyboard.pressed("D")) moveCameraLookAtToXNegative();

    if (keyboard.pressed("left")) rotateCameraLookAtToYPositive();
    if (keyboard.pressed("right")) rotateCameraLookAtToYNegative();

    if (keyboard.pressed("up")) rotateCameraLookAtToXPositive();
    if (keyboard.pressed("down")) rotateCameraLookAtToXNegative();

    if (keyboard.pressed("Q")) rotateCameraLookAtToZPositive();
    if (keyboard.pressed("E")) rotateCameraLookAtToZNegative();

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
