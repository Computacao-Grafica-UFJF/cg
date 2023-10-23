import * as THREE from "three";

class CurrentSpeedText extends THREE.Sprite {
    constructor() {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = 576;
        canvas.height = 320;
        context.fillStyle = "white";
        context.font = "72px Roboto";
        context.fillText("Speed: 0", 120, 150);

        const texture = new THREE.CanvasTexture(canvas);

        const material = new THREE.SpriteMaterial({
            map: texture,
            color: 0xffffff,
        });

        super(material);

        this.scale.set(7, 7, 1);
        this.position.set(-14, 13, 1);
    }

    updateSpeed = (speed) => {
        const formattedSpeed = speed.toFixed(3);
        const canvas = this.material.map.image;
        const context = canvas.getContext("2d");

        context.clearRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = "white";
        context.font = "72px Roboto";
        context.fillText("Speed: " + formattedSpeed, 120, 150);

        this.material.map.needsUpdate = true;
    };
}

export default CurrentSpeedText;
