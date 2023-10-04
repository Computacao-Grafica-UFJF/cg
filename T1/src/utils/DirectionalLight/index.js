import * as THREE from "three";

class DirectionalLight extends THREE.DirectionalLight {
    constructor(x, y, z) {
        super(0xffffff);
        this.intensity = 1;
        this.position.copy(new THREE.Vector3(x, y, z));

        this.sizeConfig();
        this.shadowConfig();
    }

    sizeConfig() {
        this.shadow.mapSize.width = 4092;
        this.shadow.mapSize.height = 4092;
        this.shadow.camera.left = -400;
        this.shadow.camera.right = 400;
        this.shadow.camera.top = 400;
        this.shadow.camera.bottom = -400;
    }

    shadowConfig() {
        this.castShadow = true;
        this.shadow.mapSize.width = 512;
        this.shadow.mapSize.height = 512;
        this.shadow.camera.near = 0.5;
        this.shadow.camera.far = 1000;
        this.shadow.camera.left = -16 / 2;
        this.shadow.camera.right = 16 / 2;
        this.shadow.camera.bottom = -16 / 2;
        this.shadow.camera.top = 16 / 2;
    }
}

export default DirectionalLight;
