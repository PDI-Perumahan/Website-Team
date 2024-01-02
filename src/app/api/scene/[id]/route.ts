import { prisma } from "@/lib/prisma";
import { sceneSchema } from "../route";

export async function GET({ params }: { params: { id: string } }) {
  const id = params.id;

  const scenes = await prisma.scene.findUnique({
    where: { id: id },
  });

  return new Response(JSON.stringify(scenes), { status: 200 });
}

export async function PUT({
  params,
  request,
}: {
  params: { id: string };
  request: Request;
}) {
  const id = params.id;
  const data = await request.json();

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
