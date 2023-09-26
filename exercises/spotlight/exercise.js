import * as THREE from "three";
import GUI from "../../libs/util/dat.gui.module.js";
import { OrbitControls } from "../../build/jsm/controls/OrbitControls.js";
import { initRenderer, onWindowResize } from "../../libs/util/util.js";
import { loadLightPostScene } from "../../libs/util/utilScenes.js";

const scene = new THREE.Scene();
const renderer = initRenderer();
renderer.setClearColor("rgb(30, 30, 42)");
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.lookAt(0, 0, 0);
camera.position.set(5, 5, 5);
camera.up.set(0, 1, 0);
new OrbitControls(camera, renderer.domElement);

window.addEventListener(
    "resize",
    function () {
        onWindowResize(camera, renderer);
    },
    false
);

const getAmbientLight = () => {
    const ambientColor = "#0c0c0c";
    const ambientLight = new THREE.AmbientLight(ambientColor);
    return ambientLight;
};

const getSpotlight = () => {
    const position = new THREE.Vector3(2.8, 2.8, 0);
    const color = "white";
    const spotlight = new THREE.SpotLight(color);
    spotlight.position.copy(position);
    spotlight.angle = THREE.MathUtils.degToRad(30);
    spotlight.penumbra = 1;
    spotlight.decay = 1;
    spotlight.distance = 20;

    spotlight.castShadow = true;

    spotlight.rotateX(THREE.MathUtils.degToRad(180));

    return spotlight;
};

const axesHelper = new THREE.AxesHelper(3);
axesHelper.visible = false;
scene.add(axesHelper);

const createBall = () => {
    const ballGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const ballMaterial = new THREE.MeshPhongMaterial({ color: "yellow" });
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.set(1.4, 2.8, 0);
    return ball;
};

scene.add(getSpotlight(), getAmbientLight(), createBall());

loadLightPostScene(scene);

buildInterface();
render();

function buildInterface() {
    const gui = new GUI();
}

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
