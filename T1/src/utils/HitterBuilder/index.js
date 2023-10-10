import * as THREE from "three";

import { CSG } from "../../../../libs/other/CSGMesh.js";

class HitterBuilder {
    static buildObjects(radius, height) {
        const auxMat = new THREE.Matrix4();
        const cutCylinderWithCube = 1;

        const cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(radius * 2, radius * 2, radius * 2));
        const cylinderMesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 50));

        let csgObject, cubeCSG, cylinderCSG;

        cubeMesh.position.set(0, 0, radius * cutCylinderWithCube);
        this.updateObject(cubeMesh);
        cubeCSG = CSG.fromMesh(cubeMesh);
        cylinderCSG = CSG.fromMesh(cylinderMesh);
        csgObject = cylinderCSG.intersect(cubeCSG);

        const mesh = CSG.toMesh(csgObject, auxMat);

        return mesh;
    }

    static updateObject(mesh) {
        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();
    }
}

export default HitterBuilder;
