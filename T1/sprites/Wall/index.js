import * as THREE from "three";

class Wall extends THREE.Mesh {
    constructor(x, y, z, radiusTop, radiusBottom, height, radialSegments, rotate = null) {
        let cylinderGeometry;
        if (rotate) {
            cylinderGeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments).rotateX(Math.PI / 2).rotateY(Math.PI / 2);
        } else {
            cylinderGeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
        }

        const cylinderMaterial = new THREE.MeshBasicMaterial({ color: "rgb(0, 0, 0)" });

        super(cylinderGeometry, cylinderMaterial);

        this.translateX(x);
        this.translateY(y);
        this.translateZ(z);
    }
}

export default Wall;
