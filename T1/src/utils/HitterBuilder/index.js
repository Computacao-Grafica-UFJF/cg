import * as THREE from "three";

import { CSG } from "../../../../libs/other/CSGMesh.js";

class HitterBuilder {
    static buildObjects(radius, height) {
        const auxMat = new THREE.Matrix4();
        const cutCylinderWithCube = 1;

        const cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(radius * 2, radius * 2, radius * 2));
        const cylinderMesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 50));

        cubeMesh.position.set(0, 0, radius * cutCylinderWithCube);
        this.updateObject(cubeMesh);

        const cubeCSG = CSG.fromMesh(cubeMesh);
        const cylinderCSG = CSG.fromMesh(cylinderMesh);
        const csgObject = cylinderCSG.intersect(cubeCSG);

        const mesh = CSG.toMesh(csgObject, auxMat);

        return mesh;
    }

    static updateObject(mesh) {
        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();
    }
}

export default HitterBuilder;
