import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getAllUserOrders } from "@/db/userData/orders";
import OrdersHistory from "./_components/OrdersHistory";

export default async function MyOrdersPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const ordersHistory =
    user && user.email && (await getAllUserOrders(user.email));

  return (
    <>
      <h1 className="text-balance text-4xl">Your Orders History</h1>

      {ordersHistory && ordersHistory.length >= 1 ? (
        <OrdersHistory orders={ordersHistory} />
      ) : (
        <p className="my-8 text-pretty text-center text-base">
          You haven&apos;t made any purchases in our store yet.
        </p>
      )}
    </>
  );
}
