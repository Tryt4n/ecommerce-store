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
