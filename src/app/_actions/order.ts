"use server";

import db from "@/db/db";
import { getUser } from "@/db/user";
import { emailSchema } from "@/lib/zod/emailSchema";
import { createDownloadVerification } from "./download";
import type { Product } from "@prisma/client";
import { sendEmailWithOrderHistory } from "@/lib/resend/emails";

export async function userOrderExist(email: string, productId: Product["id"]) {
  try {
    return (
      (await db.order.findFirst({
        where: { user: { email }, productId },
        select: { id: true },
      })) != null
    );
  } catch (error) {
    console.error(error);
  }
}

export async function emailOrdersHistory(
  prevState: unknown,
  formData: FormData
): Promise<{ message?: string; error?: string }> {
  const result = emailSchema.safeParse(formData.get("email"));

  if (result.success === false) {
    return { error: "Invalid email address." };
  }

  const user = await getUser(result.data);
  const success_message =
    "Check your email to view your orders history and download your products.";

  if (user == null) {
    return {
      message: success_message,
    };
  }

  // Map orders to include downloadVerification promises
  const ordersWithPromises = user.orders.map(async (order) => {
    const downloadVerification = await createDownloadVerification(
      order.product.id
    );
    if (!downloadVerification) {
      throw new Error(
        `Download verification not found for product ${order.product.id}.`
      );
    }
    return {
      ...order,
      downloadVerification,
    };
  });

  // Wait for all promises to resolve
  const orders = await Promise.all(ordersWithPromises);

  const data = await sendEmailWithOrderHistory(user.email, orders);

  if (data?.error) {
    return {
      error: "There was an error sending your email. Please try again.",
    };
  }

  return { message: success_message };
}
