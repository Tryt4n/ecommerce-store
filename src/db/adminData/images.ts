import db from "../init";
import { deleteImageInImageKit } from "@/lib/imagekit/files";
import type { Image } from "@prisma/client";

export async function deleteImage(id: Image["id"]) {
  try {
    await Promise.all([
      deleteImageInImageKit(id),
      db.image.delete({ where: { id } }),
    ]);
  } catch (error) {
    console.error(`Can't delete image. Error: ${error}`);
  }
}
