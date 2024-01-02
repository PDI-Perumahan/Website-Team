"use client";

import React, {
  Suspense,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const Model = ({ model }: { model: string | File }) => {
  const [gltf, setGltf] = useState<GLTF | null>(null);

  useEffect(() => {
    const loader = new GLTFLoader();

    if (typeof model === "string") {
      loader.load(model, (result) => {
        setGltf(result);
      });
    } else {
      model.arrayBuffer().then((buffer) => {
        loader.parse(buffer, "", (result) => {
          setGltf(result);
        });
      });
    }
  }, [model]);

  const modelRef = useRef<THREE.Object3D>();
  const minScale = 1;
  let scale = 1;

  useEffect(() => {
    if (modelRef.current) {
      const box = new THREE.Box3().setFromObject(modelRef.current);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      // eslint-disable-next-line react-hooks/exhaustive-deps
      scale = 1 / Math.max(size.x, size.y, size.z);
      scale = Math.max(scale, minScale);
      modelRef.current.scale.set(scale, scale, scale);
      modelRef.current.position.copy(center).multiplyScalar(-scale); // Center the model
    }
  }, [gltf]);

  if (!gltf) {
    return null;
  }

  return <primitive ref={modelRef} object={gltf.scene} position={[0, 0, 0]} />;
};

const Environment = () => {
  return (
    <>
      <hemisphereLight args={[0xffffff, 0x666666, 1.2]} />
      <directionalLight
        args={[0xffffff, 1]}
        position={[500, 500, 500]}
        castShadow
      />
    </>
  );
};

const AssetViewer = forwardRef<
  HTMLCanvasElement,
  { model: string | File; hidden?: boolean }
>(({ model, hidden }, ref) => {
  return (
    <Canvas
      ref={ref}
      hidden={hidden}
      gl={{
        antialias: true,
      }}
    >
      <PerspectiveCamera
        makeDefault
        fov={75}
        aspect={window.innerWidth / window.innerHeight}
        near={0.1}
        far={1000}
        position={[10, 0, 0]}
        zoom={4}
      />
      <OrbitControls
        enableDamping
        dampingFactor={0.25}
        screenSpacePanning={false}
      />
      <Suspense fallback={null}>
        <Model model={model} />
        <Environment />
      </Suspense>
    </Canvas>
  );
});

AssetViewer.displayName = "AssetViewer";

export default AssetViewer;
