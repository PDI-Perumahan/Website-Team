import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const asset = await prisma.assets.findUnique({
    where: { id: id },
  });

  return new Response(JSON.stringify(asset), { status: 200 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const asset = await prisma.assets.delete({
    where: { id: id },
  });

  return new Response(JSON.stringify(asset), { status: 200 });
}
