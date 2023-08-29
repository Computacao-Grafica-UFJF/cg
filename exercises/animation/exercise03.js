import * as THREE from "three";
import Stats from "../../build/jsm/libs/stats.module.js";
import GUI from "../../libs/util/dat.gui.module.js";
import { TrackballControls } from "../../build/jsm/controls/TrackballControls.js";
import { initRenderer, initCamera, onWindowResize, initDefaultBasicLight } from "../../libs/util/util.js";

const stats = new Stats();
const scene = new THREE.Scene();
const renderer = initRenderer();
const camera = initCamera(new THREE.Vector3(5, 5, 7));
const trackballControls = new TrackballControls(camera, renderer.domElement);
initDefaultBasicLight(scene);

let angle = 0;
let angle2 = 0;
let speed = 0.05;
let animationOn = true;

const axesHelper = new THREE.AxesHelper(12);
scene.add(axesHelper);

const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
const sphereMaterial = new THREE.MeshPhongMaterial({ color: "rgb(180,180,255)" });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

scene.add(sphere);
sphere.translateX(1.0).translateY(1.0).translateZ(1.0);

const cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2.0, 25);
const cylinderMaterial = new THREE.MeshPhongMaterial({ color: "rgb(100,255,100)" });
const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
sphere.add(cylinder);

const cylinderGeometry2 = new THREE.CylinderGeometry(0.07, 0.07, 1.0, 25);
const cylinderMaterial2 = new THREE.MeshPhongMaterial({ color: "rgb(255,100,100)" });
const cylinder2 = new THREE.Mesh(cylinderGeometry2, cylinderMaterial2);
cylinder.add(cylinder2);

const cylinderGeometry3 = new THREE.CylinderGeometry(0.07, 0.07, 1.0, 25);
const cylinderMaterial3 = new THREE.MeshPhongMaterial({ color: "rgb(255,255,0)", shininess: 1000 });
const cylinder3 = new THREE.Mesh(cylinderGeometry3, cylinderMaterial3);
cylinder2.add(cylinder3);

const cylinderGeometry4 = new THREE.CylinderGeometry(0.07, 0.07, 1.0, 25);
const cylinderMaterial4 = new THREE.MeshPhongMaterial({ color: "rgb(255,255,0)", shininess: 1000 });
const cylinder4 = new THREE.Mesh(cylinderGeometry4, cylinderMaterial4);
cylinder2.add(cylinder4);

window.addEventListener(
    "resize",
    () => {
        onWindowResize(camera, renderer);
    },
    false
);

buildInterface();
render();

function rotateCylinders() {
    cylinder.matrixAutoUpdate = false;
    cylinder2.matrixAutoUpdate = false;
    cylinder3.matrixAutoUpdate = false;
    cylinder4.matrixAutoUpdate = false;

    if (animationOn) {
        angle += speed;
        angle2 += speed * 2;

        const mat4 = new THREE.Matrix4();
        cylinder.matrix.identity();
        cylinder2.matrix.identity();
        cylinder3.matrix.identity();
        cylinder4.matrix.identity();

        cylinder.matrix.multiply(mat4.makeRotationZ(angle));
        cylinder.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0));

        cylinder2.matrix.multiply(mat4.makeRotationY(angle2));
        cylinder2.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0));
        cylinder2.matrix.multiply(mat4.makeRotationX(THREE.MathUtils.degToRad(90)));

        cylinder3.matrix.multiply(mat4.makeRotationY(angle2));
        cylinder3.matrix.multiply(mat4.makeTranslation(0.0, 0.5, 0.0));
        cylinder3.matrix.multiply(mat4.makeRotationX(THREE.MathUtils.degToRad(90)));

        cylinder4.matrix.multiply(mat4.makeRotationY(-angle2));
        cylinder4.matrix.multiply(mat4.makeTranslation(0.0, -0.5, 0.0));
        cylinder4.matrix.multiply(mat4.makeRotationX(THREE.MathUtils.degToRad(90)));
    }
}

function buildInterface() {
    const controls = new (function () {
        this.onChangeAnimation = function () {
            animationOn = !animationOn;
        };
        this.speed = 0.05;

        this.changeSpeed = function () {
            speed = this.speed;
        };
    })();

    const gui = new GUI();
    gui.add(controls, "onChangeAnimation", true).name("Animation On/Off");
    gui.add(controls, "speed", 0.05, 0.5)
        .onChange(function (e) {
            controls.changeSpeed();
        })
        .name("Change Speed");
}

function render() {
    stats.update();
    trackballControls.update();
    rotateCylinders();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
