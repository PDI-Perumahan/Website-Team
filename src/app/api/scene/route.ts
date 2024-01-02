import { prisma } from "@/lib/prisma";
import { z } from "zod";

const wallSchema = z.object({
  id: z.number(),
  start: z.object({ x: z.number(), y: z.number() }),
  end: z.object({ x: z.number(), y: z.number() }),
  colour: z.string(),
});

const objectSchema = z.object({
  id: z.number(),
  position: z.object({ x: z.number(), y: z.number(), z: z.number() }),
  rotation: z.object({ x: z.number(), y: z.number(), z: z.number() }),
  scale: z.object({ x: z.number(), y: z.number(), z: z.number() }),
  objectId: z.string(),
});

export const sceneSchema = z.object({
  name: z.string(),
  scene: z.object({
    wall: z.array(wallSchema),
    object: z.array(objectSchema),
  }),
});

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const parsedData = sceneSchema.parse(data);
    const scene = await prisma.scene.create({ data: parsedData });
    return new Response(JSON.stringify(scene), { status: 201 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}

export async function GET() {
  const scenes = await prisma.scene.findMany();

  return new Response(JSON.stringify(scenes), { status: 200 });
}
