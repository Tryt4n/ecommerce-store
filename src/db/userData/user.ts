"use server";

import db from "../init";
import type { DiscountCode } from "@prisma/client";

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

export async function createOrEditUserWithOrder(
  id: string,
  email: string,
  products: { productId: string; quantity: number; priceInCents: number }[],
  orderId: string,
  discountCodeId?: DiscountCode["id"]
) {
  try {
    const user = await db.user.upsert({
      where: { email },
      create: {
        email,
        id,
        orders: {
          create: {
            id: orderId,
            pricePaidInCents: products.reduce(
              (total, product) =>
                total + product.priceInCents * product.quantity,
              0
            ),
            discountCodeId,
            orderItems: {
              createMany: {
                data: products.map((product) => ({
                  productId: product.productId,
                  quantity: product.quantity,
                })),
              },
            },
          },
        },
      },
      update: {
        orders: {
          create: {
            id: orderId,
            pricePaidInCents: products.reduce(
              (total, product) =>
                total + product.priceInCents * product.quantity,
              0
            ),
            discountCodeId,
            orderItems: {
              createMany: {
                data: products.map((product) => ({
                  productId: product.productId,
                  quantity: product.quantity,
                })),
              },
            },
          },
        },
      },
      select: {
        id: true,
        email: true,
        orders: {
          select: {
            id: true,
            pricePaidInCents: true,
            orderItems: { orderBy: { product: { name: "asc" } } },
            discountCodeId: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    console.error(`Can't create/edit user. Error: ${error}`);
  }
}
