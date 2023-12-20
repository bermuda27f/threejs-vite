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
        texSize.width / 30,
        texSize.height / 30
    );
    // Create a mesh with the geometry and material
    return new THREE.Mesh(geometry, material);
}

export function loader(interval) {
    const div = document.getElementById("loader");
    const emojis = ["😑", "😐", "😊"];
    let counter = 0;
    let content = [];
    function updateemojis() {
        div.innerHTML = `${emojis[counter]}<p id="loadingP" style='font-size: small';><br>loading</p>`;
        counter++;

        // reset
        if (counter >= emojis.length) {
            counter = 0;
            content = [];
        }
    }
    // Set an interval to update the emojis every 333 msec
    interval = setInterval(updateemojis, 333);
}

export function removeLoader(interval) {
    // Stop the interval when the div is removed
    clearInterval(interval);
    document.getElementById("loader").remove();
}
