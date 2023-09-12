import * as THREE from "three";

class Raycaster extends THREE.Raycaster {
    constructor() {
        super();
    }

    onMouseMove = (event, level, camera) => {
        const pointer = new THREE.Vector2();
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.setFromCamera(pointer, camera);

        const intersects = this.intersectObjects([level.gamePlatform, level.platform, level.playablePlatform]);

        const intersectGamePlatform = intersects[0];
        const intersectPlatform = intersects[1];
        const intersectPlayablePlatform = intersects[2];
        const hitter = level.hitter;

        if (intersects.length === 0) {
            return;
        }

        const pointX = intersectPlayablePlatform
            ? intersectPlayablePlatform.point.x
            : intersectPlatform
            ? intersectPlatform.point.x > 0
                ? level.playablePlatform.geometry.parameters.width / 2
                : -level.playablePlatform.geometry.parameters.width / 2
            : intersectGamePlatform
            ? intersectGamePlatform.point.x > 0
                ? level.playablePlatform.geometry.parameters.width / 2
                : -level.playablePlatform.geometry.parameters.width / 2
            : undefined;

        if (pointX !== undefined) {
            hitter.moveX(pointX);
        }
    };

    onMouseDown(event, level) {
        if (event.button === 0) {
            console.log("esquerdo");

            level.pause();
        }
    }
}

export default Raycaster;
