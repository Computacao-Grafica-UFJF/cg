import Game from "./src/lib/Game/index.js";
import LevelSelector from "./src/utils/LevelSelector/index.js";
import Keyboard from "./src/utils/Keyboard/index.js";

import GUI from "../libs/util/dat.gui.module.js";

LevelSelector.startLevel();

const render = () => {
    Keyboard.keyboardListening(LevelSelector.currentLevel);

    LevelSelector.currentLevel.render();

    Game.render(render);
};

// function buildInterface() {
//     var controls = new (function () {
//         this.refraction = false;
//         this.onSetRefraction = function () {
//             if (this.refraction) this.cubeMapTexture.mapping = THREE.CubeRefractionMapping;
//             else this.cubeMapTexture.mapping = THREE.CubeReflectionMapping;
//             this.gamePlatform.needsUpdate = true;
//         };
//     })();
//     // const gui = new GUI();
//     // gui.add(controls, "refraction", false)
//     //     .name("Refraction")
//     //     .onChange(function (e) {
//     //         controls.onSetRefraction();
//     //     });
// }

// buildInterface();
render();
