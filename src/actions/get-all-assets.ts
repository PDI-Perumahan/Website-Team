"use server";

import { prisma } from "@/lib/prisma";
import { BUCKET_URL } from "@/lib/supabase";

export async function getAllAssets() {
  const assets = await prisma.assets.findMany();

  assets.map((asset) => {
    asset.modelUrl = new URL(asset.modelUrl, BUCKET_URL).href;
    asset.thumbnailUrl = new URL(asset.thumbnailUrl, BUCKET_URL).href;
  });

  return assets;
}
