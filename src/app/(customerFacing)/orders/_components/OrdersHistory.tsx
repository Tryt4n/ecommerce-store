import React from "react";
import { formatCurrency } from "@/lib/formatters";
import Link from "next/link";
import ImageThumbnail from "@/components/ImageThumbnail";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import type { getAllUserOrders } from "@/db/userData/orders";

export default function OrdersHistory({
  orders,
}: {
  orders: NonNullable<Awaited<ReturnType<typeof getAllUserOrders>>>;
}) {
  return (
    <ul className="my-8">
      {orders.map((order, index) => (
        <li key={order.id}>
          <section
            className={`flex flex-row flex-wrap items-center justify-center gap-4 transition-colors has-[h2>a:hover]:opacity-75 sm:flex-nowrap sm:gap-8 ${index < orders.length - 1 ? "py-8" : "pt-8"}`}
          >
            <ImageThumbnail
              src={order.product.images[0].url}
              alt={order.product.name}
              thumbnailContainerClassNames="bg-muted flex-shrink-0"
              containerClassNames="relative h-full w-full "
              thumbnailContainerStyles={{ height: 250 }}
            />

            <div className="flex flex-grow flex-row flex-wrap justify-between gap-2 sm:gap-4">
              <hgroup className="space-y-1">
                <div>
                  <h2 className="max-w-fit text-balance text-xl font-semibold leading-6 underline-offset-4 transition-colors hover:text-muted-foreground hover:underline">
                    <Link
                      href={`/products/${order.product.id}`}
                      className="outline-offset-4"
                    >
                      {order.product.name}
                    </Link>
                  </h2>
                  <p className="line-clamp-2 text-pretty">
                    {order.product.description}
                  </p>
                </div>
                <p className="text-xl font-semibold">
                  {formatCurrency(order.product.priceInCents / 100)}
                </p>
              </hgroup>

              <time
                dateTime={order.createdAt.toUTCString()}
                className="text-sm text-muted-foreground"
              >
                {format(order.createdAt, "dd MMM yyyy, hh:mm ", {
                  locale: pl,
                })}
              </time>
            </div>
          </section>

          {index < orders.length - 1 && <Separator />}
        </li>
      ))}
    </ul>
  );
}
