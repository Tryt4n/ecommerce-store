"use server";

import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import fs from "fs/promises";
import db from "@/db/init";
import type {
  editProductSchema,
  productAddSchema,
} from "@/lib/zod/productSchema";
import type { z } from "zod";
import type { Product } from "@prisma/client";

export async function getAllProducts(
  orderBy: keyof Product = "name",
  type: "asc" | "desc" = "asc"
) {
  try {
    const products = await db.product.findMany({
      select: {
        id: true,
        name: true,
        priceInCents: true,
        isAvailableForPurchase: true,
        description: true,
        filePath: true,
        imagePath: true,
        _count: { select: { orders: true } },
      },
      orderBy: { [orderBy]: type },
    });

    return products;
  } catch (error) {
    console.error(`Can't get products. Error: ${error}`);
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

    revalidatePath("/");
    revalidatePath("/products");
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

    revalidatePath("/");
    revalidatePath("/products");
  } catch (error) {
    console.error(`Can't update product. Error: ${error}`);
  }
}

export async function toggleProductAvailability(
  id: Product["id"],
  availability: Product["isAvailableForPurchase"]
) {
  try {
    await db.product.update({
      where: { id },
      data: { isAvailableForPurchase: availability },
    });

    revalidatePath("/");
    revalidatePath("/products");
  } catch (error) {
    console.error(`Can't toggle product availability. Error: ${error}`);
  }
}

export async function deleteProduct(id: Product["id"]) {
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

    revalidatePath("/");
    revalidatePath("/products");
  } catch (error) {
    console.error(`Can't delete product. Error: ${error}`);
  }
}
