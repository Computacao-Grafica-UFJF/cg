import * as THREE from "three";

class Raycaster extends THREE.Raycaster {
    constructor() {
        super();
    }

    onMouseMove = (event, hitter, playablePlatform, camera) => {
        const pointer = new THREE.Vector2();
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.setFromCamera(pointer, camera);
        const intersects = this.intersectObjects([playablePlatform]);

        if (intersects.length > 0) {
            const point = intersects[0].point;

            hitter.moveX(point.x);
        }
    };
}

export default Raycaster;
