import db from "./db";

export async function getMostPopularProducts(numberOfProducts: number = 6) {
  try {
    const products = db.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { orders: { _count: "desc" } },
      take: numberOfProducts,
    });

    return products;
  } catch (error) {
    console.error(`Can't get most popular products. Error: ${error}`);
  }
}

export async function getNewestProducts(numberOfProducts: number = 6) {
  try {
    const products = db.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { createdAt: "desc" },
      take: numberOfProducts,
    });

    return products;
  } catch (error) {
    console.error(`Can't get newest products. Error: ${error}`);
  }
}

export async function getProduct(id: string) {
  try {
    const product = await db.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        priceInCents: true,
        isAvailableForPurchase: true,
        filePath: true,
        imagePath: true,
      },
    });

    return product;
  } catch (error) {
    console.error(`Can't get product. Error: ${error}`);
  }
}

export async function getProducts() {
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
      orderBy: { name: "asc" },
    });

    return products;
  } catch (error) {
    console.error(`Can't get products. Error: ${error}`);
  }
}
