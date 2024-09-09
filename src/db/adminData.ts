"use server";

import db from "@/db/db";
import fs from "fs/promises";
import { notFound } from "next/navigation";
import type {
  editProductSchema,
  productAddSchema,
} from "@/lib/zod/productSchema";
import type { z } from "zod";
import type { Product } from "@prisma/client";

export async function getSalesData() {
  try {
    const data = await db.order.aggregate({
      _sum: { pricePaidInCents: true },
      _count: true,
    });

    return {
      amount: (data._sum.pricePaidInCents || 0) / 100,
      numberOfSales: data._count,
    };
  } catch (error) {
    console.error(`Can't get sales data. Error: ${error}`);
  }
}

export async function getUsersData() {
  try {
    const [userCount, orderData] = await db.$transaction([
      db.user.count(),
      db.order.aggregate({
        _sum: { pricePaidInCents: true },
      }),
    ]);

    return {
      userCount,
      averageValuePerUser:
        userCount === 0
          ? 0
          : (orderData._sum.pricePaidInCents || 0) / userCount / 100,
    };
  } catch (error) {
    console.error(`Can't get users data. Error: ${error}`);
  }
}

export async function getProductsData() {
  try {
    const [activeProducts, inactiveProducts] = await db.$transaction([
      db.product.count({
        where: { isAvailableForPurchase: true },
      }),
      db.product.count({
        where: { isAvailableForPurchase: false },
      }),
    ]);

    return {
      activeProducts,
      inactiveProducts,
    };
  } catch (error) {
    console.error(`Can't get products data. Error: ${error}`);
  }
}

export async function createProduct(data: z.infer<typeof productAddSchema>) {
  try {
    await fs.mkdir("products", { recursive: true });
    const filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));

    await fs.mkdir("public/products", { recursive: true });
    const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.image.arrayBuffer())
    );

    await db.product.create({
      data: {
        isAvailableForPurchase: false,
        name: data.name,
        description: data.description,
        priceInCents: data.priceInCents,
        filePath,
        imagePath,
      },
    });
  } catch (error) {
    console.error(`Can't create product. Error: ${error}`);
  }
}

export async function updateProduct(
  data: z.infer<typeof editProductSchema>,
  product: Partial<Product> & {
    filePath: NonNullable<Product["filePath"]>;
    imagePath: NonNullable<Product["imagePath"]>;
  }
) {
  try {
    let filePath = product.filePath;
    let imagePath = product.imagePath;

    if (data.file != null && data.file.size > 0) {
      await fs.unlink(product.filePath);
      filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
      await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));
    }

    if (data.image != null && data.image.size > 0) {
      await fs.unlink(`public${product.imagePath}`);
      imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
      await fs.writeFile(
        `public${imagePath}`,
        Buffer.from(await data.image.arrayBuffer())
      );
    }

    await db.product.update({
      where: { id: product.id },
      data: {
        name: data.name,
        description: data.description,
        priceInCents: data.priceInCents,
        filePath,
        imagePath,
      },
    });
  } catch (error) {
    console.error(`Can't update product. Error: ${error}`);
  }
}

export async function toggleProductAvailability(
  id: string,
  availability: boolean
) {
  try {
    await db.product.update({
      where: { id },
      data: { isAvailableForPurchase: availability },
    });
  } catch (error) {
    console.error(`Can't toggle product availability. Error: ${error}`);
  }
}

export async function deleteProduct(id: string) {
  try {
    const product = await db.product.findUnique({
      where: { id },
      select: { filePath: true, imagePath: true },
    });

    if (product == null) return notFound();

    Promise.all([
      await fs.unlink(product.filePath),
      await fs.unlink(`public${product.imagePath}`),
      await db.product.delete({ where: { id } }),
    ]);
  } catch (error) {
    console.error(`Can't delete product. Error: ${error}`);
  }
}
