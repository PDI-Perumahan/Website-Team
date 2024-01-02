"use server";
import { prisma } from "@/lib/prisma";

export async function deleteScene(id: string) {
  const scene = await prisma.scene.findUnique({
    where: {
      id: id,
    },
  });

  if (!scene) {
    throw new Error(`Scene with id ${id} does not exist.`);
  }

  await prisma.scene.delete({
    where: {
      id: id,
    },
  });
}
