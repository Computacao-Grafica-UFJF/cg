import * as THREE from "three";

class DirectionalLight extends THREE.DirectionalLight {
    constructor(x = 4, y = 6, z = 10) {
        super(0xffffff);
        this.intensity = 1;
        this.position.copy(new THREE.Vector3(x, y, z));

        this.shadowConfig();
    }

    shadowConfig() {
        this.castShadow = true;
        this.shadow.mapSize.width = 4098;
        this.shadow.mapSize.height = 4098;
        this.shadow.camera.near = 0.5;
        this.shadow.camera.far = 30;
        this.shadow.camera.left = -50;
        this.shadow.camera.right = 50;
        this.shadow.camera.top = 50;
        this.shadow.camera.bottom = -50;
        this.shadow.radius = 2;
        this.shadow.bias = -0.0005;

        this.shadow.color = new THREE.Color(0xf0f);
    }
}

export default DirectionalLight;
