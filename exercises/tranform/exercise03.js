import * as THREE from "three";
import Stats from "../../build/jsm/libs/stats.module.js";
import GUI from "../../libs/util/dat.gui.module.js";
import { TrackballControls } from "../../build/jsm/controls/TrackballControls.js";
import { initRenderer, initCamera, onWindowResize, initDefaultBasicLight } from "../../libs/util/util.js";

let scene = new THREE.Scene();
let stats = new Stats();
let renderer = initRenderer();
let camera = initCamera(new THREE.Vector3(7, 7, 7));
let trackballControls = new TrackballControls(camera, renderer.domElement);
initDefaultBasicLight(scene);

let angle = [-1.57, 0, 0];

let axesHelper = new THREE.AxesHelper(12);
scene.add(axesHelper);

let s1 = createSphere();
scene.add(s1);

let c1 = createCylinder();
s1.add(c1);

let s2 = createSphere();
c1.add(s2);

let c2 = createCylinder();
s2.add(c2);

let s3 = createSphere();
c2.add(s3);

let c3 = createCylinder();
s3.add(c3);

window.addEventListener(
    "resize",
    () => {
        onWindowResize(camera, renderer);
    },
    false
);

buildInterface();
render();

function createSphere() {
    const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({ color: "rgb(180,180,255)" });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    return sphere;
}

function createCylinder() {
    const cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2.0, 25);
    const cylinderMaterial = new THREE.MeshPhongMaterial({ color: "rgb(100,255,100)" });
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    return cylinder;
}

function rotateCylinder() {
    c1.matrixAutoUpdate = false;
    s2.matrixAutoUpdate = false;
    c2.matrixAutoUpdate = false;
    s3.matrixAutoUpdate = false;
    c3.matrixAutoUpdate = false;

    c1.matrix.identity();
    s2.matrix.identity();
    c2.matrix.identity();
    s3.matrix.identity();
    c3.matrix.identity();

    let mat4 = new THREE.Matrix4();

    c1.matrix.multiply(mat4.makeRotationZ(angle[0]));
    c1.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0));

    s2.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0));

    c2.matrix.multiply(mat4.makeRotationZ(angle[1]));
    c2.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0));

    s3.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0));

    c3.matrix.multiply(mat4.makeRotationZ(angle[2]));
    c3.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0));
}

function buildInterface() {
    let controls = new (function () {
        this.joint1 = 270;
        this.joint2 = 0;
        this.joint3 = 0;

        this.rotate = function () {
            angle[0] = THREE.MathUtils.degToRad(this.joint1);
            angle[1] = THREE.MathUtils.degToRad(this.joint2);
            angle[2] = THREE.MathUtils.degToRad(this.joint3);
            rotateCylinder();
        };
    })();

    let gui = new GUI();
    gui.add(controls, "joint1", 0, 360)
        .onChange(function () {
            controls.rotate();
        })
        .name("First Joint");

    gui.add(controls, "joint2", 0, 360)
        .onChange(function () {
            controls.rotate();
        })
        .name("Second Joint");

    gui.add(controls, "joint3", 0, 360)
        .onChange(function () {
            controls.rotate();
        })
        .name("Third Joint");
}

function render() {
    stats.update();
    trackballControls.update();
    rotateCylinder();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
