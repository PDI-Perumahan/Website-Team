import { FeatureItem } from "@/types";
import vrImage from "@/assets/images/vr.jpg";
import uploadImage from "@/assets/images/upload.jpg";
import previewImage from "@/assets/images/preview.jpg";

export const featuresItem: FeatureItem[] = [
  {
    title: "Virtual Reality Experience",
    subtitle: "Designing Rooms Virtually",
    description:
      "Experience the sensation of designing rooms virtually using virtual reality technology.",
    imageSrc: vrImage,
  },
  {
    title: "3D Asset Upload",
    subtitle: "Enhance Your Game",
    description:
      "Upload the assets in 3D format you want to use in the game through this website.",
    imageSrc: uploadImage,
  },
  {
    title: "In-Game Design Preview",
    subtitle: "See Your Creations",
    description: "Preview the designs you create in the game on the website.",
    imageSrc: previewImage,
  },
];
