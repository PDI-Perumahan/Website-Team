"use server";

import { prisma } from "@/lib/prisma";
import { client } from "@/lib/supabase";

export async function deleteAsset(id: string) {
  const asset = await prisma.assets.findUnique({
    where: {
      id: id,
    },
  });

  if (!asset) {
    throw new Error(`Asset with id ${id} does not exist.`);
  }

  await prisma.assets.delete({
    where: {
      id: id,
    },
  });

  await client.storage.from("model-bucket/models").remove([asset.modelUrl]);
}
