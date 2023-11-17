import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';


const jsonInfoDiv = document.getElementById("jsonInfo");
const filename = jsonInfoDiv.getAttribute("data-filename");

fetch(`../../media/3d-env/${filename}`)
    .then(response => response.json())
    .then(data => {
        console.log("Data JSON:", data);
        display3DObjects(data);
    });

function display3DObjects(data) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("3dCanvas") });
    renderer.setClearColor(0x87CEEB); // 0xFFFFFF adalah kode warna hexadecimal untuk putih

    data["3d-diagram"]["3d-object"].forEach((object, index) => {
        console.log("Loading object:", object);

        const loader = new GLTFLoader();
        loader.load(`../../media/models/obj/${object}.glb`, (gltf) => {
            const mesh = gltf.scene.children[0];
            
            const position = new THREE.Vector3().fromArray(data["3d-diagram"]["places"][index]);
            const rotation = new THREE.Euler().fromArray(data["3d-diagram"]["rotation"][index]);
            const scale = new THREE.Vector3().fromArray(data["3d-diagram"]["scale"][index]);

            mesh.position.copy(position);
            // mesh.rotation.copy(rotation);
            mesh.scale.copy(scale);

            scene.add(mesh);

            console.log(`${object} loaded.`);
            console.log(`Position: x: ${position.x}, y: ${position.y}, z: ${position.z}`);
            console.log(`Rotation: x: ${rotation.x}, y: ${rotation.y}, z: ${rotation.z}`);
            console.log(`Scale: x: ${scale.x}, y: ${scale.y}, z: ${scale.z}`);
        });
    });
    // Buat penerangan dasar
    const light = new THREE.HemisphereLight(0xffffff, 0x666666, 1.2);
    scene.add(light);
    const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
    topLight.position.set(500, 500, 500) //top-left-ish
    topLight.castShadow = true;
    scene.add(topLight);

    const floorGeometry = new THREE.PlaneGeometry(100, 100, 100, 100);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, side: THREE.DoubleSide, metalness: 0.5, roughness: 0.7 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);


    camera.position.set(10,1,1);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Set up PointerLockControls
    const controls = new PointerLockControls(camera, renderer.domElement);
    scene.add(controls.getObject());

    // document.addEventListener('click', () => {
    //     controls.lock();
    // });


    document.addEventListener('mousedown', () => {
        controls.lock();
    });

    document.addEventListener('mouseup', () => {
        controls.unlock();
    });

    let zoomSpeed = 0.001;
    document.addEventListener('wheel', (event) => {
        // Zoom in or out based on the direction of the mouse scroll
        const delta = event.deltaY;
        controls.getObject().translateZ(delta * zoomSpeed);
    });

    // Keyboard controls
    const keys = { W: false, A: false, S: false, D: false };

    document.addEventListener('keydown', (event) => {
        handleKeyDown(event.code);
    });

    document.addEventListener('keyup', (event) => {
        handleKeyUp(event.code);
    });

    function handleKeyDown(keyCode) {
        if (keyCode === 'KeyW') keys.W = true;
        if (keyCode === 'KeyA') keys.A = true;
        if (keyCode === 'KeyS') keys.S = true;
        if (keyCode === 'KeyD') keys.D = true;
    }

    function handleKeyUp(keyCode) {
        if (keyCode === 'KeyW') keys.W = false;
        if (keyCode === 'KeyA') keys.A = false;
        if (keyCode === 'KeyS') keys.S = false;
        if (keyCode === 'KeyD') keys.D = false;
    }

    // Fungsi animasi loop
    function animate() {
        requestAnimationFrame(animate);
        // Update controls
        // controls.update();

        // Update camera position based on keyboard input
        const movementSpeed = 0.1;

        if (keys.W) controls.getObject().translateZ(-movementSpeed);
        if (keys.A) controls.getObject().translateX(-movementSpeed);
        if (keys.S) controls.getObject().translateZ(movementSpeed);
        if (keys.D) controls.getObject().translateX(movementSpeed);

        const minY = 0.5; // Adjust this value as needed
        controls.getObject().position.y = Math.max(minY, controls.getObject().position.y);

        renderer.render(scene, camera);
    }

    animate();
}
// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });