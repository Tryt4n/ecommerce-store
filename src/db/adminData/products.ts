"use server";

import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import db from "@/db/init";
import { getCreatedAtQuery } from "@/lib/dashboardDataHelpers";
import { getCategoryIds } from "../userData/categories";
import { deleteImageInImageKit } from "@/lib/imagekit/files";
import type { Prisma, Product } from "@prisma/client";
import type { z } from "zod";
import type { productAddSchema } from "@/lib/zod/productSchema";
import type { UploadedFile, UploadedImage } from "@/lib/imagekit/type";
import type { SortingType } from "@/types/sort";
import type { DateRange } from "@/types/ranges";

export async function getAllProducts(
  orderBy: keyof Product = "name",
  type: SortingType = "asc",
  dateRange?: DateRange
) {
  try {
    let createdAtQuery: Prisma.DateTimeFilter | undefined;

    if (dateRange) {
      createdAtQuery = getCreatedAtQuery(dateRange);
    }

    const products = await db.product.findMany({
      select: {
        id: true,
        name: true,
        priceInCents: true,
        isAvailableForPurchase: true,
        description: true,
        images: { take: 1, select: { url: true, id: true } },
        categories: {
          select: { category: { select: { name: true } } },
          orderBy: { category: { name: "asc" } },
        },
        _count: { select: { orders: true } },
      },
      orderBy: { [orderBy]: type },
      where: { createdAt: createdAtQuery },
    });

    // Convert the query result so that _count is a number
    const transformedProducts = products.map((product) => ({
      ...product,
      _count: product._count.orders,
      categories: product.categories.map((category) => category.category.name),
    }));

    return transformedProducts;
  } catch (error) {
    console.error(`Can't get products. Error: ${error}`);
  }
}

export async function createProduct(data: z.infer<typeof productAddSchema>) {
  try {
    // await fs.mkdir("products", { recursive: true });
    // const filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
    // await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));

    await db.$transaction(async (tx) => {
      // Find all categories IDs
      const categoryIds = await getCategoryIds(tx, data.categories);

      // Make sure only the first image is the main one
      const images = data.images.map((image, index) => ({
        ...image,
        isMainForProduct: index === 0,
      }));

      // Create the product
      await tx.product.create({
        data: {
          isAvailableForPurchase: false,
          name: data.name,
          description: data.description,
          priceInCents: data.priceInCents,
          images: { create: images },
          productFile: { create: data.productFile },
          categories: {
            create: categoryIds.map((categoryId) => ({
              categoryId,
            })),
          },
        },
      });
    });

    revalidatePath("/");
    revalidatePath("/products");
  } catch (error) {
    console.error(`Can't create product. Error: ${error}`);
  }
}

export async function updateProduct(
  data: z.infer<typeof productAddSchema>,
  product: Partial<Product> &
    Required<Pick<Product, "id">> & {
      images: UploadedImage[];
      productFile: UploadedFile;
    }
) {
  try {
    // let filePath = product.filePath;

    // if (data.file != null && data.file.size > 0) {
    //   await fs.unlink(product.filePath);
    //   filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
    //   await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));
    // }

    await db.$transaction(async (tx) => {
      // Find current product categories
      const currentCategories = await tx.productCategory.findMany({
        where: { productId: product.id },
        select: { category: { select: { name: true } } },
      });

      const currentCategoryNames = currentCategories.map(
        (category) => category.category.name
      );

      // Create a set of new categories
      const newCategoryNames = data.categories;

      // Add new categories that are not yet assigned to the product
      const categoriesToAdd = newCategoryNames.filter(
        (name) => !currentCategoryNames.includes(name)
      );

      // Find all categories IDs
      const categoryIdsToAdd = await getCategoryIds(tx, categoriesToAdd);

      // Assign new categories to the product
      await Promise.all(
        categoryIdsToAdd.map((categoryId) =>
          tx.productCategory.create({
            data: {
              productId: product.id,
              categoryId,
            },
          })
        )
      );

      // Remove categories that are no longer assigned to the product
      const categoriesToRemove = currentCategoryNames.filter(
        (name) => !newCategoryNames.includes(name)
      );

      // Remove categories from the product
      await Promise.all(
        categoriesToRemove.map((categoryName) =>
          tx.productCategory.deleteMany({
            where: {
              productId: product.id,
              category: { name: categoryName },
            },
          })
        )
      );

      // Find current product images
      const currentImages = await tx.image.findMany({
        where: { productId: product.id },
      });

      const currentImageIds = currentImages.map((image) => image.id);
      const newImageIds = data.images.map((image) => image.id);

      // Images to disconnect
      const imagesToDisconnect = currentImageIds.filter(
        (id) => !newImageIds.includes(id)
      );

      // Images to create
      const imagesToCreate = data.images.filter(
        (image) => !currentImageIds.includes(image.id)
      );

      // Delete images from imagekit
      Promise.all([
        imagesToDisconnect.map(async (id) => await deleteImageInImageKit(id)),
      ]);

      // Update the product
      await tx.product.update({
        where: { id: product.id },
        data: {
          name: data.name,
          description: data.description,
          priceInCents: data.priceInCents,
          productFile: {
            disconnect: product.productFile
              ? { id: product.productFile.id }
              : undefined,
            create: data.productFile,
          },
          images: {
            deleteMany: imagesToDisconnect.map((id) => ({ id })),
            create: imagesToCreate,
            // Make sure only the first image is the main one
            updateMany: data.images.map((image, index) => ({
              where: { id: image.id },
              data: { isMainForProduct: index === 0 },
            })),
          },
        },
      });
    });

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${product.id}`);
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
      select: {
        productFile: { select: { id: true } },
        images: { select: { id: true } },
      },
    });

    if (product == null) return notFound();

    await Promise.all([
      // await fs.unlink(product.filePath),
      //TODO: delete productFile
      product.images.map(
        async (image) => await deleteImageInImageKit(image.id)
      ),
      db.image.deleteMany({ where: { productId: id } }),
      db.product.delete({ where: { id } }),
    ]);

    revalidatePath("/");
    revalidatePath("/products");
  } catch (error) {
    console.error(`Can't delete product. Error: ${error}`);
  }
}
