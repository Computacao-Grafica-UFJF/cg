import { GLTFLoader as GLTFLoaderThreeJS } from "../../../../build/jsm/loaders/GLTFLoader.js";
import { getMaxSize } from "../../../../libs/util/util.js";
import Game from "../../lib/Game/index.js";
import * as THREE from "three";

/**
 * @deprecated
 */
class GLTFLoader {
    static loadGLTFFile(modelPath, modelName, desiredScale, angle, visibility) {
        const loader = new GLTFLoaderThreeJS();
        loader.load(modelPath + modelName + ".glb", (gltf) => {
            let obj = gltf.scene;
            obj.visible = visibility;
            obj.name = getFilename(modelName);
            obj.traverse((child) => {
                if (child.isMesh) child.castShadow = true;
                if (child.material) child.material.side = THREE.DoubleSide;
            });

            obj = normalizeAndRescale(obj, desiredScale);
            obj = fixPosition(obj);
            obj.rotateY(THREE.MathUtils.degToRad(angle));

            gltf.scene.add(obj);
            Game.scene.add(...gltf.scene);
            assetManager[modelName] = obj;
        });
    }

    static normalizeAndRescale(obj, newScale) {
        const scale = getMaxSize(obj);
        obj.scale.set(newScale * (1.0 / scale), newScale * (1.0 / scale), newScale * (1.0 / scale));
        return obj;
    }

    static fixPosition(obj) {
        const box = new THREE.Box3().setFromObject(obj);
        box.min.y > 0 ? obj.translateY(-box.min.y) : obj.translateY(-1 * box.min.y);
        return obj;
    }
}

export default GLTFLoader;
