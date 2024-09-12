"use server";

import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import fs from "fs/promises";
import db from "@/db/db";
import type {
  editProductSchema,
  productAddSchema,
} from "@/lib/zod/productSchema";
import type { z } from "zod";
import type { DiscountCode, Prisma, Product } from "@prisma/client";
import type { addDiscountSchema } from "@/lib/zod/discount";

// Products
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

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/admin/users");
    revalidatePath("/admin/orders");
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
    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/admin/users");
    revalidatePath("/admin/orders");
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

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/admin/users");
    revalidatePath("/admin/orders");
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

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/admin/users");
    revalidatePath("/admin/orders");
  } catch (error) {
    console.error(`Can't delete product. Error: ${error}`);
  }
}

// Orders
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

export async function deleteOrder(id: string) {
  try {
    const order = await db.order.delete({ where: { id } });

    if (order == null) return notFound();

    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/admin/users");
    revalidatePath("/admin/orders");
  } catch (error) {
    console.error(`Can't delete order. Error: ${error}`);
  }
}

// Users
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

export async function deleteUser(id: string) {
  try {
    const user = await db.user.delete({ where: { id } });

    if (user == null) return notFound();

    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/admin/users");
    revalidatePath("/admin/orders");
  } catch (error) {
    console.error(`Can't delete user. Error: ${error}`);
  }
}

// Discount Codes
export async function createDiscountCode(
  data: z.infer<typeof addDiscountSchema>
) {
  try {
    return await db.discountCode.create({
      data: {
        code: data.code,
        discountAmount: data.discountAmount,
        discountType: data.discountType,
        allProducts: data.allProducts,
        products:
          data.productIds != null
            ? { connect: data.productIds.map((id) => ({ id })) }
            : undefined,
        expiresAt: data.expiresAt,
        limit: data.limit,
      },
    });
  } catch (error) {
    console.error(`Can't create discount code. Error: ${error}`);
  }
}

const WHERE_EXPIRED: Prisma.DiscountCodeWhereInput = {
  OR: [
    { limit: { not: null, lte: db.discountCode.fields.uses } },
    { expiresAt: { not: null, lte: new Date() } },
  ],
};

const SELECT_FIELDS: Prisma.DiscountCodeSelect = {
  id: true,
  allProducts: true,
  code: true,
  discountAmount: true,
  discountType: true,
  expiresAt: true,
  limit: true,
  uses: true,
  isActive: true,
  products: { select: { name: true, id: true } },
  _count: { select: { orders: true } },
};

export async function getDiscountCodes(
  orderBy: keyof DiscountCode = "createdAt",
  type: "asc" | "desc" = "asc"
) {
  try {
    const [unexpiredDiscountCodes, expiredDiscountCodes] =
      await db.$transaction([
        db.discountCode.findMany({
          where: { NOT: WHERE_EXPIRED },
          select: SELECT_FIELDS,
          orderBy: { [orderBy]: type },
        }),
        db.discountCode.findMany({
          where: WHERE_EXPIRED,
          select: SELECT_FIELDS,
          orderBy: { [orderBy]: type },
        }),
      ]);

    return {
      unexpiredDiscountCodes: unexpiredDiscountCodes,
      expiredDiscountCodes: expiredDiscountCodes,
    };
  } catch (error) {
    console.error(`Error getting discount codes. Error: ${error}`);
  }
}

export async function toggleDiscountCodeActive(id: string, isActive: boolean) {
  try {
    await db.discountCode.update({
      where: { id },
      data: { isActive },
    });
  } catch (error) {
    console.error(
      `Error toggling discount code active status. Error: ${error}`
    );
  }
}

export async function deleteDiscountCode(id: string) {
  try {
    const discountCode = await db.discountCode.delete({
      where: { id },
    });

    if (discountCode == null) return notFound();
  } catch (error) {
    console.error(`Error deleting discount code. Error: ${error}`);
  }
}
