import { useEffect, useRef } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Button, ButtonProps } from "@/components/ui/button";

const Model = (model: string) => {
  const gltf = useLoader(GLTFLoader, model);

  return <primitive object={gltf.scene} />;
};

interface CaptureButtonProps {
  model: string | null;
  type: "button" | "submit" | "reset" | undefined;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

const CaptureButton = ({
  model,
  type,
  onClick,
  disabled,
  children,
  ...rest
}: CaptureButtonProps) => {
  const { gl, scene, camera } = useThree();
  const renderer = useRef(gl);
  const link = document.createElement("a");
  link.style.display = "none";
  document.body.appendChild(link);

  useEffect(() => {
    scene.add(new THREE.HemisphereLight(0xffffff, 0x666666, 1.2));
    const topLight = new THREE.DirectionalLight(0xffffff, 1);
    topLight.position.set(500, 500, 500);
    topLight.castShadow = true;
    scene.add(topLight);
    camera.position.set(0, 0, 2);
  }, [scene, camera]);

  const captureImage = async () => {
    renderer.current.render(scene, camera);
    const screenshot = renderer.current.domElement.toDataURL("image/png");

    link.href = screenshot;
    link.download = "screenshot.png";
    link.click();
  };

  return (
    <Button onClick={captureImage} type={type} disabled={disabled} {...rest}>
      {children}
    </Button>
  );
};

export default CaptureButton;
