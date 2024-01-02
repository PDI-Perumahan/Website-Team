import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default async function captureThumbnail(modelFile: File): Promise<File> {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  scene.add(new THREE.HemisphereLight(0xffffff, 0x666666, 1.2));

  const topLight = new THREE.DirectionalLight(0xffffff, 1);
  topLight.position.set(500, 500, 500);
  topLight.castShadow = true;
  scene.add(topLight);

  renderer.setSize(500, 500);

  const model = await new Promise<THREE.Object3D>((resolve) => {
    const loader = new GLTFLoader();
    loader.load(URL.createObjectURL(modelFile), (gltf) => {
      const model = gltf.scene;
      model.position.set(0, 0, 0);

      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      let scale = 1 / Math.max(size.x, size.y, size.z);

      const minScale = 0.125;

      scale = Math.max(scale, minScale);

      model.scale.set(scale, scale, scale);
      model.position.copy(center).multiplyScalar(-scale);

      // model.rotation.y = Math.PI / 2;

      resolve(gltf.scene);
    });
  });

  scene.add(model);

  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  camera.position.copy(center);
  camera.position.x += size.length() * 0.8;
  camera.lookAt(center);

  renderer.render(scene, camera);

  return new Promise((resolve) => {
    renderer.domElement.toBlob((blob) => {
      if (blob) {
        resolve(new File([blob], "thumbnail.png", { type: "image/png" }));
      } else {
        throw new Error("Failed to create thumbnail blob");
      }
    }, "image/png");
  });
}
