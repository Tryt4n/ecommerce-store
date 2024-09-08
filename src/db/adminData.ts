import db from "@/db/db";

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
