import * as THREE from "three";

class Hitter extends THREE.Mesh {
    constructor(x, y, z) {
        const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 4, 32).rotateX(Math.PI / 2).rotateY(Math.PI / 2);
        const cylinderMaterial = new THREE.MeshPhongMaterial({ color: "rgb(255, 0, 0)", shininess: 1000 });

        super(cylinderGeometry, cylinderMaterial);

        this.translateX(x);
        this.translateY(y);
        this.translateZ(z);
    }

    dance = () => {
        this.translateX(2);
    };

    moveX = (x, width) => {
        if (x > 0) {
            if (this.position.x < width / 2 - this.geometry.parameters.height / 2) {
                this.position.x = x - this.geometry.parameters.height / 2;
            }
        } else {
            if (this.position.x > -(width / 2 - this.geometry.parameters.height / 2)) {
                this.position.x = x + this.geometry.parameters.height / 2;
            }
        }
    };
}

export default Hitter;
