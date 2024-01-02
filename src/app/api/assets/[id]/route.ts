import { prisma } from "@/lib/prisma";

export async function GET({ params }: { params: { id: string } }) {
  const id = params.id;

  const asset = await prisma.assets.findUnique({
    where: { id: id },
  });

  return new Response(JSON.stringify(asset), { status: 200 });
}

export async function DELETE({ params }: { params: { id: string } }) {
  const id = params.id;

  const asset = await prisma.assets.delete({
    where: { id: id },
  });

  return new Response(JSON.stringify(asset), { status: 200 });
}
