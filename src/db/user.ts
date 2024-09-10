"use server";

import db from "./db";
import { createDownloadVerification } from "@/app/_actions/download";
import { sendEmail } from "@/lib/resend/emails";
import type { Product } from "@prisma/client";

export async function createOrEditUser(
  email: string,
  productId: Product["id"],
  pricePaidInCents: Product["priceInCents"]
) {
  try {
    const userFields = {
      email,
      orders: { create: { productId, pricePaidInCents } },
    };

    const {
      orders: [order],
    } = await db.user.upsert({
      where: { email },
      create: userFields,
      update: userFields,
      select: { orders: { orderBy: { createdAt: "desc" }, take: 1 } },
    });

    const downloadVerification = await createDownloadVerification(productId);

    await sendEmail(email);
  } catch (error) {
    console.error(`Can't create/edit user. Error: ${error}`);
  }
}
