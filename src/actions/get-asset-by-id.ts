"use server";

import { prisma } from "@/lib/prisma";
import { BUCKET_URL } from "@/lib/supabase";

export default async function getAssetById(id: string) {
  const asset = await prisma.assets.findUnique({
    where: {
      id: id,
    },
  });

  if (!asset) {
    throw new Error("Asset not found");
  }

  asset.modelUrl = new URL(asset.modelUrl, BUCKET_URL).href;
  asset.thumbnailUrl = new URL(asset.thumbnailUrl, BUCKET_URL).href;

  return asset;
}
