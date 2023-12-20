import * as THREE from "/node_modules/three/";
import { OrbitControls } from "/node_modules/three/examples/jsm/controls/OrbitControls";
import assets from "../data/assets.json";
import * as helper from "./helper.js";

export function init(w, h) {
    const loader = new THREE.TextureLoader();

    // load assets:

    const promiseTextures = assets.map((asset) => {
        return new Promise((resolve) =>
            loader.load(`img/${asset.fileName}`, resolve)
        );
    });

    Promise.all(promiseTextures).then((textures) => {
        // ... if loaded all assets, then start app:

        // set color space for all textures:
        for (let i = 0; i < textures.length; i++) {
            textures[i].colorSpace = THREE.SRGBColorSpace;
        }

        // get texture sizes
        const texSizes = textures.map((t) => {
            return {
                width: t.image.width,
                height: t.image.height,
            };
        });

        // init scen:
        const scene = new THREE.Scene();

        // initial camera settings
        const camera = new THREE.PerspectiveCamera(45, w / h, 1, 1000);
        camera.position.set(0, 0, 100);
        camera.lookAt(scene.position);

        // renderer
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(w, h);

        // remove loade, append the scene
        helper.removeLoader();
        document.body.appendChild(renderer.domElement);

        // white background plane
        const planeSize = 1000;
        const planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize);
        const planeMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff, // => white plane
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.z = -1;

        scene.add(plane);

        // draw a grid
        const color = new THREE.Color(0.7, 0.7, 0.7);
        const grid = new THREE.GridHelper(
            1000, // size
            300, // divisions,
            color, // color center lines
            color // color grid lines
        );
        grid.rotation.x = -Math.PI / 2;
        grid.position.z = 0;

        scene.add(grid);

        // draw textures / images:

        for (let i = 0; i < assets.length; i++) {
            const texture = helper.textureMesh(textures[i], texSizes[i]);
            // positions stored in data/assets.json:
            texture.position.x = assets[i].pos.x;
            texture.position.y = assets[i].pos.y;
            scene.add(texture);
        }

        // create OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enablePan = true;
        controls.touches.ONE = THREE.TOUCH.PAN;
        controls.enableZoom = true;
        controls.enableRotate = false;
        controls.maxDistance = 300;
        controls.minDistance = 50;
        controls.target.set(0, 0, 0); // Set the center of rotation

        // add event listeners
        let interacting = true;
        const animate = () => {
            if (interacting) {
                // update canvas:
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
            }
        };

        // check if view exceeds limits
        controls.addEventListener("change", () => {
            // random values, needs calculation (plane-size is reference)
            var min_x = -100;
            var max_x = 100;
            var min_y = -100;
            var max_y = 100;

            let pos_x = Math.min(max_x, Math.max(min_x, camera.position.x));
            let pos_y = Math.min(max_y, Math.max(min_y, camera.position.y));

            camera.position.set(pos_x, pos_y, camera.position.z);
            camera.lookAt(pos_x, pos_y, controls.target.z);

            controls.target.x = pos_x;
            controls.target.y = pos_y;
        });

        controls.addEventListener("start", () => {
            interacting = true;
            animate();
        });

        controls.addEventListener("end", () => {
            interacting = false;
        });

        // window resize:
        window.addEventListener("resize", () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.render(scene, camera);
        });
        renderer.render(scene, camera);
    });
}