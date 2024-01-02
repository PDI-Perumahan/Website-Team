"use server";

import { prisma } from "@/lib/prisma";

export async function getAllScenes() {
  const scenes = await prisma.scene.findMany();

  return scenes;
}
