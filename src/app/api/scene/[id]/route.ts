import { prisma } from "@/lib/prisma";
import { sceneSchema } from "../route";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const scenes = await prisma.scene.findUnique({
    where: { id: id },
  });

  return new Response(JSON.stringify(scenes), { status: 200 });
}

export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: { id: string };
  }
) {
  const id = params.id;
  const data = await req.json();

  try {
    const parsedData = sceneSchema.parse(data);

    const scene = await prisma.scene.update({
      where: { id: id },
      data: parsedData,
    });

    return new Response(JSON.stringify(scene), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}

export async function DELETE({ params }: { params: { id: string } }) {
  const id = params.id;

  const scene = await prisma.scene.delete({
    where: { id: id },
  });

  return new Response(JSON.stringify(scene), { status: 200 });
}
