"use server";
import { prisma } from "@/lib/prisma";

export default async function getSceneById(id: string) {
  const scene = await prisma.scene.findUnique({
    where: {
      id: id,
    },
  });

  if (!scene) {
    throw new Error("Scene not found");
  }

  return scene;
}
