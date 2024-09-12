import db from "@/db/db";
import { cache } from "@/lib/cache";

export const getOrders = cache(async () => {
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
}, ["/admin/orders", "getOrders"]);
