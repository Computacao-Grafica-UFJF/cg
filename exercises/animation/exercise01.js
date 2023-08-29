import * as THREE from "three";
import Stats from "../../build/jsm/libs/stats.module.js";
import GUI from "../../libs/util/dat.gui.module.js";
import { TrackballControls } from "../../build/jsm/controls/TrackballControls.js";
import { initRenderer, initCamera, onWindowResize, initDefaultBasicLight, createGroundPlaneXZ } from "../../libs/util/util.js";

const stats = new Stats();
const scene = new THREE.Scene();
const renderer = initRenderer();
const camera = initCamera(new THREE.Vector3(0, 10, -10));
const trackballControls = new TrackballControls(camera, renderer.domElement);
initDefaultBasicLight(scene);

let speed = 0.05;
const animationOn = [false, false];

const axesHelper = new THREE.AxesHelper(12);
const plane = createGroundPlaneXZ(20, 20);

scene.add(axesHelper, plane);

window.addEventListener(
    "resize",
    () => {
        onWindowResize(camera, renderer);
    },
    false
);

const createSphere = (x, y, z) => {
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({ color: "rgb(255, 0, 0)", shininess: 1000 });

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    sphere.translateX(x).translateY(y).translateZ(z);

    return sphere;
};

const sphere1 = createSphere(5.0, 0.5, 2.5);
const sphere2 = createSphere(5.0, 0.5, -2.5);

scene.add(sphere1, sphere2);

const sphere1Config = {
    destination: new THREE.Vector3(-5.0, 0.5, 2.5),
    alpha: 0.01,
    move: true,
};

const sphere2Config = {
    destination: new THREE.Vector3(-5.0, 0.5, -2.5),
    alpha: 0.02,
    move: true,
};

buildInterface();
render();

function buildInterface() {
    const controls = new (function () {
        this.speed = 0.01;

        this.changeSpeed = () => {
            sphere1Config.alpha = controls.speed;
            sphere2Config.alpha = controls.speed * 2;
        };

        this.reset = () => {
            sphere1
                .translateX(5.0 - sphere1.position.x)
                .translateY(0.5 - sphere1.position.y)
                .translateZ(2.5 - sphere1.position.z);

            sphere2
                .translateX(5.0 - sphere2.position.x)
                .translateY(0.5 - sphere2.position.y)
                .translateZ(-2.5 - sphere2.position.z);
        };
    })();

    const gui = new GUI();
    gui.add(sphere1Config, "move", true).onChange().name(`Sphere 1 On/Off`);
    gui.add(sphere2Config, "move", true).onChange().name(`Sphere 2 On/Off`);

    gui.add(controls, "reset", true)
        .onChange((e) => controls.changeSpeed())
        .name("Reset");
    gui.add(controls, "speed", 0.05, 0.25).name("Speed").onChange();
}

function render() {
    stats.update();
    trackballControls.update();

    if (sphere1Config.move) sphere1.position.lerp(sphere1Config.destination, sphere1Config.alpha);
    if (sphere2Config.move) sphere2.position.lerp(sphere2Config.destination, sphere2Config.alpha);

    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
