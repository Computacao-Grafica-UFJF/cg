import * as THREE from "three";
import Stats from "../../../build/jsm/libs/stats.module.js";
import { TrackballControls } from "../../../build/jsm/controls/TrackballControls.js";
import { initRenderer, onWindowResize, initDefaultBasicLight } from "../../../libs/util/util.js";
import Hitter from "../../sprites/Hitter/index.js";
import Block from "../../sprites/Block/index.js";
import OrthographicCameraWrapper from "../../utils/OrthographicCameraWrapper/index.js";
import Platform from "../../sprites/Platform/index.js";

const scene = new THREE.Scene();
const stats = new Stats();
const renderer = initRenderer();
const camera = new OrthographicCameraWrapper();
camera.disableZoom();
const trackballControls = new TrackballControls(camera, renderer.domElement);
initDefaultBasicLight(scene);

const buildLevel = () => {
    const buildPlatform = () => {
        const platform = new Platform(15, 30, 0x00ff00);
        return platform;
    };

    const buildHitter = () => {
        const hitter = new Hitter(0, -10, 0);
        return hitter;
    };

    const buildBlocks = () => {
        const blocks = [];

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                blocks.push(new Block(i + i * 0.1 - 5, j + j * 0.1 + 5, 0).translateY(-1));
            }
        }

        return blocks;
    };

    const level = [buildPlatform(), buildHitter(), ...buildBlocks()];

    return level;
};

const level = buildLevel();
scene.add(...level);

window.addEventListener(
    "resize",
    () => {
        onWindowResize(camera, renderer, 30);
    },
    false
);

window.addEventListener("mousemove", onMouseMove);

// -- Create raycaster
let raycaster = new THREE.Raycaster();

// Object to represent the intersection point
let intersectionSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 30, 30, 0, Math.PI * 2, 0, Math.PI),
    new THREE.MeshPhongMaterial({ color: "orange", shininess: "200" })
);
scene.add(intersectionSphere);

// Use raycaster to intersect planes
function onMouseMove(event) {
    // intersectionSphere.visible = true;
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components
    let pointer = new THREE.Vector2();
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // update the picking ray with the camera and pointer position
    raycaster.setFromCamera(pointer, camera);
    // calculate objects intersecting the picking ray
    let intersects = raycaster.intersectObjects(scene.children);
    //    let intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0) {
        // Check if there is a intersection
        let point = intersects[0].point; // Pick the point where interception occurrs
        // intersectionSphere.visible = true;
        intersectionSphere.position.set(point.x, point.y, point.z);
        const hitterObject = level.find((object) => object instanceof Hitter);

        hitterObject.moveX(point.x);
    }
}

const render = () => {
    stats.update();
    trackballControls.update();
    requestAnimationFrame(render);

    renderer.render(scene, camera);
};

// function clearSelected()
// {
//    for (let i = 0; i < objects.length; i++)
//       objects[i].material.emissive.setRGB(0, 0, 0);
// }

// function showInterceptionCoords(layer, point)
// {
//    leftBox.changeMessage("Intersection on Layer " + layer + "  [" +
//        point.x.toFixed(2) + ", " +
//        point.y.toFixed(2) + ", " +
//        point.z.toFixed(2) + "]");
// }

export default render;
