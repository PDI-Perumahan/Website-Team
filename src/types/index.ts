import { StaticImageData } from "next/image";

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
};

export type NavItem = {
  name: string;
  url: string;
};

export type FeatureItem = {
  title: string;
  subtitle: string;
  description: string;
  imageSrc: StaticImageData | string;
};

export interface SceneModel {
  id: number;
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
  };
  scale: {
    x: number;
    y: number;
    z: number;
  };
  objectId: string;
  modelUrl: string;
}
