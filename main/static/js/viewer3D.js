import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Initialize the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Append the renderer to the DOM
document.body.appendChild(renderer.domElement);

// Adjust the renderer size
renderer.setSize(window.innerWidth, window.innerHeight);

// Initialize the controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.minPolarAngle = Math.PI * 0.5; // Batas bawah (90 derajat dalam radian)
controls.maxPolarAngle = Math.PI * 0.5; // Batas atas (90 derajat dalam radian)
controls.update();

// Function to set up the environment
function setupEnvironment() {
  scene.add(new THREE.HemisphereLight(0xffffff, 0x666666, 1.2));
  const topLight = new THREE.DirectionalLight(0xffffff, 1);
  topLight.position.set(500, 500, 500);
  topLight.castShadow = true;
  scene.add(topLight);
  camera.position.set(5, 0, 0);
}

// Function to load the model
export function loadModel(url) {
  setupEnvironment();

  // Initialize the GLTFLoader
  const loader = new GLTFLoader();
  loader.load(url, (gltf) => {
    const model = gltf.scene;
    model.position.set(0,1,0);
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
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
