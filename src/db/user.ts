"use server";

import db from "./db";
import { createDownloadVerification } from "@/app/_actions/download";
import { cache } from "@/lib/cache";
import { sendPurchaseEmail } from "@/lib/resend/emails";
import type { Product, User } from "@prisma/client";

export async function createOrEditUser(
  email: string,
  product: Partial<Product> &
    Required<Pick<Product, "id" | "name" | "description" | "imagePath">>,
  pricePaidInCents: Product["priceInCents"]
) {
  try {
    const userFields = {
      email,
      orders: { create: { productId: product.id, pricePaidInCents } },
    };

    const {
      orders: [order],
    } = await db.user.upsert({
      where: { email },
      create: userFields,
      update: userFields,
      select: { orders: { orderBy: { createdAt: "desc" }, take: 1 } },
    });

    const downloadVerification = await createDownloadVerification(product.id);

    downloadVerification &&
      (await sendPurchaseEmail(email, order, product, downloadVerification));
  } catch (error) {
    console.error(`Can't create/edit user. Error: ${error}`);
  }
}

export async function getUser(email: string) {
  try {
    return await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        orders: {
          select: {
            id: true,
            pricePaidInCents: true,
            createdAt: true,
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                imagePath: true,
                filePath: true,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error(`Can't get user. Error: ${error}`);
  }
}

export const getUsers = cache(
  async (orderBy: keyof User = "createdAt", type: "asc" | "desc" = "desc") => {
    try {
      return db.user.findMany({
        select: {
          id: true,
          email: true,
          orders: {
            select: {
              id: true,
              pricePaidInCents: true,
              product: true,
              productId: true,
            },
          },
        },
        orderBy: { [orderBy]: type },
      });
    } catch (error) {
      console.error(`Can't get users. Error: ${error}`);
    }
  },
  ["/admin/users", "getUsers"]
);
