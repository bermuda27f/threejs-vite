// helper / aux functions

import * as THREE from "/node_modules/three/";

export function textureMesh(texture, texSize) {
    // Create a material with the texture
    const material = new THREE.MeshBasicMaterial({
        transparent: true,
        map: texture,
    });
    // Create a geometry (e.g., a plane)
    const geometry = new THREE.PlaneGeometry(
        texSize.width / 15,
        texSize.height / 15
    );
    // Create a mesh with the geometry and material
    return new THREE.Mesh(geometry, material);
}