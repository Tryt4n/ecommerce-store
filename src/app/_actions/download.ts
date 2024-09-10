import db from "@/db/db";
import type { Product } from "@prisma/client";

export async function createDownloadVerification(productId: Product["id"]) {
  try {
    return await db.downloadVerification.create({
      data: {
        productId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
      },
    });
  } catch (error) {
    console.error(`Can't create download verification. Error: ${error}`);
  }
}

export async function getDownloadVerification(downloadVerificationId: string) {
  try {
    return await db.downloadVerification.findUnique({
      where: { id: downloadVerificationId, expiresAt: { gt: new Date() } },
      select: { product: true },
    });
  } catch (error) {
    console.error(`Can't get download verification. Error: ${error}`);
  }
}
