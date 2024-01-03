import React, { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import getAssetById from "@/actions/get-asset-by-id";
import { SceneModel } from "@/types";

interface WallProps {
  start: { x: number; y: number };
  end: { x: number; y: number };
  colour: string;
}

const Ground: React.FC = () => {
  const grassTexture = useLoader(
    THREE.TextureLoader,
    "https://jedqepcstttqpnfnxgyq.supabase.co/storage/v1/object/public/virtual-dream/textures/grass.jpg"
  );

  const repeatX = 50;
  const repeatY = 50;

  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(repeatX, repeatY);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial map={grassTexture} />
    </mesh>
  );
};

const Wall: React.FC<WallProps> = ({ start, end, colour }) => {
  const position = useMemo(() => {
    const x = (start.x + end.x) / 2;
    const z = (start.y + end.y) / 2;
    const y = 4;
    return [x, y, z];
  }, [start, end]);

  const size = useMemo(() => {
    const length = Math.sqrt(
      Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2)
    );
    const width = 0.5;
    const height = 8;
    return [length, height, width];
  }, [start, end]);

  const angle = useMemo(
    () => Math.atan2(end.y - start.y, end.x - start.x),
    [start, end]
  );

  return (
    <mesh
      position={new THREE.Vector3(position[0], position[1], position[2])}
      rotation={[0, angle, 0]}
    >
      <boxGeometry args={[size[0], size[1], size[2]]} />
      <meshStandardMaterial color={colour} />
    </mesh>
  );
};

interface ModelProps {
  modelUrl: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

const Model: React.FC<ModelProps> = ({
  modelUrl,
  position,
  rotation,
  scale,
}) => {
  const [gltf, setGltf] = useState<GLTF | null>(null);
  const modelRef = useRef<THREE.Object3D>();

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(modelUrl, (result) => {
      setGltf(result);
    });
  }, [modelUrl]);

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.x = rotation[0];
      modelRef.current.rotation.y = rotation[1];
      modelRef.current.rotation.z = rotation[2];
      modelRef.current.scale.set(scale[0], scale[1], scale[2]);
    }
  });

  if (!gltf) {
    return null;
  }

  return <primitive ref={modelRef} object={gltf.scene} position={position} />;
};

interface SceneProps {
  jsonData: {
    walls: Array<{
      id: number;
      start: { x: number; y: number };
      end: { x: number; y: number };
      colour: string;
    }>;
    objects: Array<{
      id: number;
      position: { x: number; y: number; z: number };
      rotation: { x: number; y: number; z: number };
      scale: { x: number; y: number; z: number };
      objectId: string;
    }>;
  };
}

const Scene: React.FC<SceneProps> = ({ jsonData }) => {
  const [models, setModels] = useState<SceneModel[]>([]);

  useEffect(() => {
    const loadModels = async () => {
      const modelPromises = jsonData.objects.map((obj) =>
        getModelFromObjectId(obj.objectId).then((modelUrl) => ({
          ...obj,
          modelUrl,
        }))
      );

      const loadedModels = await Promise.all(modelPromises);
      setModels(loadedModels);
    };

    loadModels();
  }, [jsonData]);

  return (
    <>
      <Ground />
      {jsonData.walls.map((wall, index) => (
        <Wall
          key={index}
          start={wall.start}
          end={wall.end}
          colour={wall.colour}
        />
      ))}
      {models.map((model, index) => (
        <Model
          key={index}
          modelUrl={model.modelUrl}
          position={[model.position.x, model.position.y, model.position.z]}
          rotation={[model.rotation.x, model.rotation.y, model.rotation.z]}
          scale={[model.scale.x, model.scale.y, model.scale.z]}
        />
      ))}
    </>
  );
};

const getModelFromObjectId = async (objectId: string) => {
  const asset = await getAssetById(objectId);

  if (!asset) {
    return "";
  }

  return asset.modelUrl;
};

export interface SceneRendererProps {
  walls: Array<{
    id: number;
    start: { x: number; y: number };
    end: { x: number; y: number };
    colour: string;
  }>;
  objects: Array<{
    id: number;
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    scale: { x: number; y: number; z: number };
    objectId: string;
  }>;
}

const Skybox = () => {
  const { scene, gl } = useThree();

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const url =
      "https://jedqepcstttqpnfnxgyq.supabase.co/storage/v1/object/public/virtual-dream/textures/kloofendal_48d_partly_cloudy_puresky_1k.png";
    loader.load(url, (texture) => {
      const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
      rt.fromEquirectangularTexture(gl, texture);
      scene.background = rt.texture;
    });
  }, [scene, gl]);

  return null;
};

const SceneRenderer: React.FC<SceneRendererProps> = (jsonData) => {
  return (
    <Canvas>
      <Skybox />
      <OrbitControls />
      <ambientLight intensity={1} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <Scene jsonData={jsonData} />
    </Canvas>
  );
};

export default SceneRenderer;
