import * as THREE from "three";
import Stats from "../../../build/jsm/libs/stats.module.js";
import GUI from "../../../libs/util/dat.gui.module.js";
import { TrackballControls } from "../../../build/jsm/controls/TrackballControls.js";
import { initRenderer, initCamera, initDefaultBasicLight, createGroundPlane, onWindowResize } from "../../../libs/util/util.js";

import { CSG } from "../../../libs/other/CSGMesh.js";

var scene = new THREE.Scene();
var stats = new Stats();

var renderer = initRenderer();
renderer.setClearColor("rgb(30, 30, 40)");
var camera = initCamera(new THREE.Vector3(4, -8, 8));
camera.up.set(0, 0, 1);

window.addEventListener(
    "resize",
    function () {
        onWindowResize(camera, renderer);
    },
    false
);
initDefaultBasicLight(scene, true, new THREE.Vector3(12, -15, 20), 28, 1024);

var groundPlane = createGroundPlane(20, 20);
scene.add(groundPlane);

var axesHelper = new THREE.AxesHelper(12);
scene.add(axesHelper);

var trackballControls = new TrackballControls(camera, renderer.domElement);

let mesh;

buildInterface();
buildObjects();
render();

function buildObjects() {
    const radius = 2;
    const cutSphereWithCube = 1;
    const bulgingPercentage = 0.5;
    let auxMat = new THREE.Matrix4();

    let sphereMesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 50, 50));
    let cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(2 * radius, 2 * radius, 2 * radius));

    let csgObject, cubeCSG, sphereCSG;

    cubeMesh.position.set(0, 0, -radius * cutSphereWithCube);
    updateObject(cubeMesh);
    sphereCSG = CSG.fromMesh(sphereMesh);
    cubeCSG = CSG.fromMesh(cubeMesh);
    csgObject = sphereCSG.subtract(cubeCSG);
    mesh = CSG.toMesh(csgObject, auxMat);
    mesh.material = new THREE.MeshPhongMaterial({ color: "lightblue" });
    mesh.geometry.scale(1, 1, bulgingPercentage);
    mesh.position.set(0, 0, -cutSphereWithCube + 2 * bulgingPercentage);

    scene.add(mesh);
}

function updateObject(mesh) {
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();
}

function buildInterface() {
    var controls = new (function () {
        this.wire = false;

        this.onWireframeMode = function () {
            mesh.material.wireframe = this.wire;
        };
    })();

    // GUI interface
    var gui = new GUI();
    gui.add(controls, "wire", false)
        .name("Wireframe")
        .onChange(function (e) {
            controls.onWireframeMode();
        });
}

function render() {
    stats.update();
    trackballControls.update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
