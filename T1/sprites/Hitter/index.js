import * as THREE from "three";

class Hitter extends THREE.Mesh {
    constructor(x, y, z) {
        const sphereGeometry = new THREE.CylinderGeometry(0.5, 0.5, 5, 32).rotateX(Math.PI / 2).rotateY(Math.PI / 2);
        const sphereMaterial = new THREE.MeshPhongMaterial({ color: "rgb(255, 0, 0)", shininess: 1000 });

        super(sphereGeometry, sphereMaterial);

        this.translateX(x);
        this.translateY(y);
        this.translateZ(z);
    }

    dance = () => {
        this.translateX(2);
    };
}

export default Hitter;
