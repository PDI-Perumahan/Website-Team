import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Initialize the scene, camera, and renderer
export function loadModel(url, object_id) {
const doc_id = document.getElementById(object_id);


const width = 300;
const height = 170;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(0x87CEEB); // 0xFFFFFF adalah kode warna hexadecimal untuk putih

// Initialize the controls
const controls = new OrbitControls(camera, renderer.domElement);
// controls.minPolarAngle = Math.PI * 0.5; // Batas bawah (90 derajat dalam radian)
// controls.maxPolarAngle = Math.PI * 0.5; // Batas atas (90 derajat dalam radian)

// Append the renderer to the DOM
doc_id.appendChild(renderer.domElement);

// Adjust the renderer size
renderer.setSize(width, height);

// Function to set up the environment
// function setupEnvironment() {
  scene.add(new THREE.HemisphereLight(0xffffff, 0x666666, 1.2));
  const topLight = new THREE.DirectionalLight(0xffffff, 1);
  topLight.position.set(500, 500, 500);
  topLight.castShadow = true;
  scene.add(topLight);
  camera.position.set(0, 0, 2);
// }

// Function to load the model

//   setupEnvironment();

  // Initialize the GLTFLoader
  const loader = new GLTFLoader();
  loader.load(url, (gltf) => {
    const model = gltf.scene;
    model.position.set(0,0,0);
    // Hitung bounding box dari model
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    let scale = 1 / Math.max(size.x, size.y, size.z);
    //Tentukan skala minimum yang diizinkan
    const minScale = 0.125;
    
    // Pastikan skala tidak lebih kecil dari skala minimum
    scale = Math.max(scale, minScale);
    console.log(url+ " " + scale);

    // Skalakan model
    model.scale.set(scale, scale, scale);

    scene.add(model);

    // Update the controls target
    controls.target.copy(model.position);
    controls.update();

    // Set up the animation loop
    function animate() {
      requestAnimationFrame(animate);
      controls.update(); // Update controls every frame

      renderer.render(scene, camera);
    }

    animate();
  }, undefined, function (error) {
    console.error('An error happened while loading the model:', error);
  });
}

// Handle window resize
// window.addEventListener('resize', () => {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// });
