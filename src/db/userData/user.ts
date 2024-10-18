"use server";

import db from "../init";
import { sendPurchaseEmail } from "@/lib/resend/emails";
import { updateDiscountCode } from "../adminData/discountCodes";
import type { DiscountCode, Product } from "@prisma/client";
import type { getProduct } from "./products";

export async function createOrEditUser(
  email: string,
  product: NonNullable<Awaited<ReturnType<typeof getProduct>>>,
  pricePaidInCents: Product["priceInCents"],
  discountCodeId?: DiscountCode["id"]
) {
  try {
    const userFields = {
      email,
      orders: {
        create: { productId: product.id, pricePaidInCents, discountCodeId },
      },
    };

    const {
      orders: [order],
    } = await db.user.upsert({
      where: { email },
      create: userFields,
      update: userFields,
      select: { orders: { orderBy: { createdAt: "desc" }, take: 1 } },
    });

    if (discountCodeId) {
      await updateDiscountCode(discountCodeId, { uses: { increment: 1 } });
    }

    await sendPurchaseEmail(email, order, product);
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
                images: { select: { id: true, url: true } },
                productFile: { select: { id: true, name: true, url: true } },
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
