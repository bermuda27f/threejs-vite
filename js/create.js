import * as THREE from "/node_modules/three/";
import { OrbitControls } from "/node_modules/three/examples/jsm/controls/OrbitControls";

export function init(w, h) {
    const loader = new THREE.TextureLoader();

    // load assets:

    const promiseTextures = [
        new Promise((resolve) =>
            loader.load("img/wuerfel_transparent.png", resolve)
        ),
        new Promise((resolve) => loader.load("img/avocado.png", resolve)),
    ];

    // ... if, then:

    Promise.all(promiseTextures).then((textures) => {
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

        // set canvas size:
        const width = w;
        const height = h;

        // initial camera settings
        const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
        camera.position.set(0, 0, 50);
        camera.lookAt(scene.position);

        // renderer
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);

        // append the scene
        document.body.appendChild(renderer.domElement);

        // white background plane
        const planeSize = 500;
        const planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize);
        const planeMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff, // White color
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.z = -1;

        scene.add(plane);

        // draw a grid
        const color = new THREE.Color(0.5, 0.5, 0.5);
        const grid = new THREE.GridHelper(
            500, // size
            100, // divisions,
            color, // center lines
            color // grid lines
        );
        grid.rotation.x = -Math.PI / 2;
        grid.position.z = 0;

        scene.add(grid);

        // draw textures / images:

        for (let i = 0; i < textures.length; i++) {
            const texture = textureMesh(textures[i], texSizes[i]);
            texture.position.x = (width / 100) * (i * 0.5);
            scene.add(texture);
        }

        // create OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enablePan = true;
        controls.touches.ONE = THREE.TOUCH.PAN;
        controls.enableZoom = true;
        controls.enableRotate = false;
        controls.maxDistance = 100;
        controls.target.set(0, 0, 0); // Set the center of rotation

        // add event listeners
        let interacting = true;
        const animate = () => {
            if (interacting) {
                requestAnimationFrame(animate);
                //controls.update();
                renderer.render(scene, camera);
            }
        };

        const maxX = 10; // Set your desired maximum X value
        const maxY = 5; // Set your desired maximum Y value

        // Listen to the 'change' event to update controls after any changes
        controls.addEventListener("change", () => {
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
            controls.target.z = 0;
            controls.update();
        });

        controls.addEventListener("start", () => {
            interacting = true;
            animate();
        });

        controls.addEventListener("end", () => {
            interacting = false;
        });

        window.addEventListener("resize", () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.render(scene, camera);
        });
        renderer.render(scene, camera);
    });
}

// aux functions
function textureMesh(texture, texSize) {
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
