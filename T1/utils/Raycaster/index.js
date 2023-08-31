import * as THREE from "three";

class Raycaster extends THREE.Raycaster {
    constructor() {
        super();
    }

    onMouseMove = (event, hitter, platform, camera) => {
        const pointer = new THREE.Vector2();
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.setFromCamera(pointer, camera);
        const intersects = this.intersectObjects(platform);

        const intersectGamePlatform = intersects[0];
        const intersectPlatform = intersects[1];
        const intersectPlayablePlatform = intersects[2];

        let pointX;

        if (intersects.length > 0) {
            if (intersectPlayablePlatform) {
                pointX = intersectPlayablePlatform.point.x;
            } else {
                if (intersectPlatform) {
                    if (intersectPlatform.point.x > 0) {
                        pointX = platform[2].geometry.parameters.width / 2;
                    } else {
                        pointX = -platform[2].geometry.parameters.width / 2;
                    }
                } else {
                    if (intersectGamePlatform) {
                        if (intersectGamePlatform.point.x > 0) {
                            pointX = platform[2].geometry.parameters.width / 2;
                        } else {
                            pointX = -platform[2].geometry.parameters.width / 2;
                        }
                    }
                }
            }

            hitter.moveX(pointX);
        }
    };
}

export default Raycaster;
