import * as THREE from "three";
import Stats from "../../../build/jsm/libs/stats.module.js";
import GUI from "../../../libs/util/dat.gui.module.js";
import { TrackballControls } from "../../../build/jsm/controls/TrackballControls.js";
import { initRenderer, initCamera, initDefaultBasicLight, createGroundPlane, onWindowResize } from "../../../libs/util/util.js";

import { CSG } from "../../../libs/other/CSGMesh.js";

const scene = new THREE.Scene();
const stats = new Stats();

const renderer = initRenderer();
renderer.setClearColor("rgb(30, 30, 40)");
const camera = initCamera(new THREE.Vector3(4, -8, 8));
camera.up.set(0, 0, 1);

window.addEventListener(
    "resize",
    () => {
        onWindowResize(camera, renderer);
    },
    false
);
initDefaultBasicLight(scene, true, new THREE.Vector3(12, -15, 20), 28, 1024);

const groundPlane = createGroundPlane(20, 20);
scene.add(groundPlane);

const axesHelper = new THREE.AxesHelper(12);
scene.add(axesHelper);

const trackballControls = new TrackballControls(camera, renderer.domElement);

let mesh;

const buildObjects = () => {
    const radius = 2;
    const height = radius / 2;

    const auxMat = new THREE.Matrix4();
    const cutCylinderWithCube = 1;

    const cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(radius * 2, radius * 2, radius * 2));
    const cylinderMesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 50));

    let csgObject, cubeCSG, cylinderCSG;

    cubeMesh.position.set(0, 0, radius * cutCylinderWithCube);
    updateObject(cubeMesh);
    cubeCSG = CSG.fromMesh(cubeMesh);
    cylinderCSG = CSG.fromMesh(cylinderMesh);
    csgObject = cylinderCSG.intersect(cubeCSG);

    mesh = CSG.toMesh(csgObject, auxMat);
    mesh.material = new THREE.MeshLambertMaterial({ color: "lightblue" });
    mesh.geometry.scale(1, 1, 0.5);

    mesh.position.set(0, 0, 0);

    // Como fica no jogo
    // mesh.rotateX(THREE.MathUtils.degToRad(270));

    scene.add(mesh);
};

const updateObject = (mesh) => {
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();
};

const buildInterface = () => {
    const controls = new (function () {
        this.wire = false;

        this.onWireframeMode = function () {
            mesh.material.wireframe = this.wire;
        };
    })();

    const gui = new GUI();
    gui.add(controls, "wire", false)
        .name("Wireframe")
        .onChange((e) => {
            controls.onWireframeMode();
        });
};

const render = () => {
    stats.update();
    trackballControls.update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
};

buildInterface();
buildObjects();
render();
