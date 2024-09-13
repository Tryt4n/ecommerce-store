"use server";

import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import fs from "fs/promises";
import db from "@/db/db";
import { startOfDay } from "date-fns";
import {
  calculateRevenueByProduct,
  createAndUpdateDaysArray,
} from "@/lib/dashboardDataHelpers";
import type {
  editProductSchema,
  productAddSchema,
} from "@/lib/zod/productSchema";
import type { z } from "zod";
import type { addDiscountSchema } from "@/lib/zod/discount";
import type {
  DiscountCode,
  Order,
  Prisma,
  Product,
  User,
} from "@prisma/client";

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
    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/admin/users");
    revalidatePath("/admin/orders");
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
    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/admin/users");
    revalidatePath("/admin/orders");
  } catch (error) {
    console.error(`Can't delete product. Error: ${error}`);
  }
}

// Orders
export async function deleteOrder(id: Order["id"]) {
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
export async function deleteUser(id: User["id"]) {
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
  products: { select: { name: true, id: true }, orderBy: { name: "asc" } },
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

export async function toggleDiscountCodeActive(
  id: DiscountCode["id"],
  isActive: DiscountCode["isActive"]
) {
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

export async function deleteDiscountCode(id: DiscountCode["id"]) {
  try {
    const discountCode = await db.discountCode.delete({
      where: { id },
    });

    if (discountCode == null) return notFound();
  } catch (error) {
    console.error(`Error deleting discount code. Error: ${error}`);
  }
}

export async function getDashboardData(
  createdAfter: Date | null,
  createdBefore: Date | null
) {
  try {
    const createdAtQuery: Prisma.DateTimeFilter = {};
    if (createdAfter) createdAtQuery.gt = createdAfter;
    if (createdBefore) createdAtQuery.lt = createdBefore;

    const [
      usersCount,
      usersCreationDates,
      salesData,
      ordersData,
      activeProductsCount,
      inactiveProductsCount,
      productsData,
    ] = await db.$transaction([
      // usersCount
      db.user.count(),
      // usersCreationDates
      db.user.findMany({
        select: { createdAt: true },
        where: { createdAt: createdAtQuery },
        orderBy: { createdAt: "asc" },
      }),
      // salesData
      db.order.aggregate({
        _sum: { pricePaidInCents: true },
        _count: true,
      }),
      // ordersData
      db.order.findMany({
        select: { createdAt: true, pricePaidInCents: true },
        where: { createdAt: createdAtQuery },
        orderBy: { createdAt: "asc" },
      }),
      // activeProducts
      db.product.count({
        where: { isAvailableForPurchase: true },
      }),
      // inactiveProducts
      db.product.count({
        where: { isAvailableForPurchase: false },
      }),
      // productsData
      db.product.findMany({
        select: { name: true, orders: { select: { pricePaidInCents: true } } },
        where: { createdAt: createdAtQuery },
      }),
    ]);

    const updatedUsersCreationDates = createAndUpdateDaysArray({
      dataArray: usersCreationDates,
      startingDate: createdAfter,
      endingDate: createdBefore,
      defaultStartingDate: startOfDay(ordersData[0].createdAt),
      dateKey: "createdAt",
      valueKey: "totalUsers",
    });

    const updatedOrdersData = createAndUpdateDaysArray({
      dataArray: ordersData,
      startingDate: createdAfter,
      endingDate: createdBefore,
      defaultStartingDate: startOfDay(ordersData[0].createdAt),
      dateKey: "createdAt",
      valueKey: "totalSales",
      valueToTransformWith: "pricePaidInCents",
    });

    const productsWithRevenue = calculateRevenueByProduct(productsData);

    return {
      usersData: {
        usersCount,
        averageValuePerUser:
          usersCount === 0
            ? 0
            : (salesData._sum.pricePaidInCents || 0) / usersCount / 100,
      },
      productsData: {
        activeProductsCount,
        inactiveProductsCount,
      },
      salesData: {
        amount: (salesData._sum.pricePaidInCents || 0) / 100,
        numberOfSales: salesData._count,
      },
      chartsData: {
        usersCreationDates: updatedUsersCreationDates,
        ordersCreationData: updatedOrdersData,
        revenueByProduct: productsWithRevenue,
      },
    };
  } catch (error) {
    console.error(`Can't get dashboard data. Error: ${error}`);
  }
}
