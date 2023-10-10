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

let mesh, mesh1, mesh2;

buildInterface();
buildObjects();
render();

function buildObjects() {
    let auxMat = new THREE.Matrix4();
    const radius = 1.05;
    const cutCylinderWithCube = 1.3;

    let cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2));
    let cylinderMesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, radius / 2, 50));

    let csgObject, cubeCSG, cylinderCSG;

    cubeMesh.position.set(0, 0, radius * cutCylinderWithCube);
    updateObject(cubeMesh);
    cubeCSG = CSG.fromMesh(cubeMesh);
    cylinderCSG = CSG.fromMesh(cylinderMesh);
    csgObject = cylinderCSG.intersect(cubeCSG);

    mesh = CSG.toMesh(csgObject, auxMat);
    mesh.material = new THREE.MeshPhongMaterial({ color: "lightblue" });
    mesh.geometry.scale(1, 1, 0.5);

    mesh.position.set(0, 0, -0.18);

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
