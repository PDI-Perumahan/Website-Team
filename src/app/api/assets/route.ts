import { prisma } from "@/lib/prisma";
import { BUCKET_NAME, MODEL_PATHS, client } from "@/lib/supabase";
import { v4 as uuid } from "uuid";
import path from "path";
import * as z from "zod";
import { Assets } from "@prisma/client";

const FormDataSchema = z.object({
  name: z.string(),
  modelFile: z.instanceof(File),
  thumbnail: z.instanceof(File),
  x: z.number(),
  y: z.number(),
  z: z.number(),
});

export async function POST(req: Request) {
  try {
    const data = await req.formData();

    const validatedData = FormDataSchema.parse({
      name: data.get("name") as unknown as string,
      modelFile: data.get("modelFile") as unknown as File,
      thumbnail: data.get("thumbnail") as unknown as File,
      x: Number(data.get("x") as unknown as string),
      y: Number(data.get("y") as unknown as string),
      z: Number(data.get("z") as unknown as string),
    });

    const id = uuid();

    const modelFilename = `model-${Date.now()}.glb`;

    const { data: resultModel, error: errorModel } = await client.storage
      .from(path.join(BUCKET_NAME, MODEL_PATHS, id))
      .upload(modelFilename, await validatedData.modelFile!.arrayBuffer());

    if (errorModel) {
      return new Response(
        JSON.stringify({
          message: "Error uploading file",
          error: errorModel,
        }),
        { status: 500 }
      );
    }

    const thumbnailFilename = `thumbnail-${Date.now()}.png`;

    const { data: resultThumbnail, error: errorThumbnail } =
      await client.storage
        .from(path.join(BUCKET_NAME, MODEL_PATHS, id))
        .upload(
          thumbnailFilename,
          await validatedData.thumbnail!.arrayBuffer()
        );

    if (errorThumbnail) {
      return new Response(
        JSON.stringify({
          message: "Error uploading file",
          error: errorThumbnail,
        }),
        { status: 500 }
      );
    }

    const created = await prisma.assets.create({
      data: {
        id,
        name: validatedData.name,
        modelUrl: path.join(MODEL_PATHS, id, resultModel.path),
        thumbnailUrl: path.join(MODEL_PATHS, id, resultThumbnail.path),
        xSize: validatedData.x,
        ySize: validatedData.y,
        zSize: validatedData.z,
      },
    });

    return new Response(
      JSON.stringify({
        message: "File uploaded successfully",
        data: created,
      })
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    console.log(error);

    return new Response(null, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.formData();
    let updateData: Partial<Assets> = {};

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(
        JSON.stringify({
          message: "ID is required",
        }),
        { status: 422 }
      );
    }

    const asset = await prisma.assets.findUnique({
      where: { id },
    });

    if (!asset) {
      return new Response(
        JSON.stringify({
          message: "Asset not found",
        }),
        { status: 404 }
      );
    }

    const validatedData = FormDataSchema.partial({
      modelFile: true,
      thumbnail: true,
    }).parse({
      name: data.get("name") as unknown as string,
      modelFile: data.get("modelFile")
        ? (data.get("modelFile") as unknown as File)
        : undefined,
      thumbnail: data.get("thumbnail")
        ? (data.get("thumbnail") as unknown as File)
        : undefined,
      x: Number(data.get("x") as unknown as string),
      y: Number(data.get("y") as unknown as string),
      z: Number(data.get("z") as unknown as string),
    });

    updateData = {
      name: validatedData.name,
      xSize: validatedData.x,
      ySize: validatedData.y,
      zSize: validatedData.z,
    };

    if (validatedData.modelFile && validatedData.thumbnail) {
      await client.storage.emptyBucket(path.join(BUCKET_NAME, MODEL_PATHS, id));

      const { data: resultModel, error: errorModel } = await client.storage
        .from(path.join(BUCKET_NAME, MODEL_PATHS, id))
        .update("model.glb", await validatedData.modelFile!.arrayBuffer());

      if (errorModel) {
        return new Response(
          JSON.stringify({
            message: "Error uploading file",
            error: errorModel,
          }),
          { status: 500 }
        );
      }

      const { data: resultThumbnail, error: errorThumbnail } =
        await client.storage
          .from(path.join(BUCKET_NAME, MODEL_PATHS, id))
          .update(
            "thumbnail.png",
            await validatedData.thumbnail!.arrayBuffer()
          );

      if (errorThumbnail) {
        return new Response(
          JSON.stringify({
            message: "Error uploading file",
            error: errorThumbnail,
          }),
          { status: 500 }
        );
      }

      updateData.modelUrl = path.join(MODEL_PATHS, id, resultModel.path);
      updateData.thumbnailUrl = path.join(
        MODEL_PATHS,
        id,
        resultThumbnail.path
      );
    }

    const updated = await prisma.assets.update({
      where: { id },
      data: updateData,
    });

    return new Response(
      JSON.stringify({
        message: "File updated successfully",
        data: updated,
      })
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    console.log(error);

    return new Response(null, { status: 500 });
  }
}

export async function GET() {
  const assets = await prisma.assets.findMany();

  return new Response(JSON.stringify(assets), { status: 200 });
}
