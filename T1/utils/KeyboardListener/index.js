import KeyboardState from "../../../libs/util/KeyboardState";
import * as THREE from "three";

class KeyboardListener extends KeyboardState {
    constructor() {
        super();
        this.key = null;
    }

    update() {
        super.update();
        this.key = this.getKey();
    }

    getKey = function () {
        for (var arg in KeyboardState.status) return arg;
    };
}

export default KeyboardListener;
