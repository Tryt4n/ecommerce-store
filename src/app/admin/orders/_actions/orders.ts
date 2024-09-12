import db from "@/db/db";

export async function getOrders() {
  try {
    return db.order.findMany({
      select: {
        id: true,
        pricePaidInCents: true,
        product: true,
        user: true,
        discountCode: {
          select: { code: true, discountType: true, discountAmount: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error(`Can't get orders. Error: ${error}`);
  }
}
