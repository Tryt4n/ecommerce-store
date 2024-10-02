"use server";

import db from "../init";
import type { Prisma } from "@prisma/client";

export async function getCategories() {
  try {
    const categories = await db.category.findMany({
      select: { name: true },
      orderBy: { name: "asc" },
    });

    return categories.map((category) => category.name);
  } catch (error) {
    console.error(`Can't get categories. Error: ${error}`);
  }
}

export async function getCategoryIds(
  tx: Prisma.TransactionClient,
  categoryNames: string[]
): Promise<string[]> {
  return Promise.all(
    // Find all categories IDs
    categoryNames.map(async (categoryName: string) => {
      let category = await tx.category.findUnique({
        where: { name: categoryName },
      });

      // Create new category if it doesn't exist
      if (!category) {
        category = await tx.category.create({
          data: { name: categoryName },
        });
      }

      return category.id;
    })
  );
}
