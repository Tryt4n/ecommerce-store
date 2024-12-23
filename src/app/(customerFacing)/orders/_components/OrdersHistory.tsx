import React from "react";
import { formatCurrency } from "@/lib/formatters";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import Link from "next/link";
import Image from "next/image";
import ImageThumbnail from "@/components/ImageThumbnail";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import type { getAllUserOrders } from "@/db/userData/orders";

export default function OrdersHistory({
  orders,
}: {
  orders: NonNullable<Awaited<ReturnType<typeof getAllUserOrders>>>;
}) {
  return (
    <ul className="mt-4 space-y-4 sm:mt-8">
      {orders.map((order) => {
        const totalDiscountedAmount = formatCurrency(
          order.pricePaidInCents / 100
        );
        const totalAmount = formatCurrency(
          order.orderItems.reduce(
            (acc, item) => acc + item.product.priceInCents * item.quantity,
            0
          ) / 100
        );

        return (
          <li key={order.id} className="rounded-lg border p-2 sm:p-4">
            <article className="flex flex-col-reverse flex-wrap justify-center gap-2 transition-colors has-[h2>a:hover]:opacity-75 sm:flex-nowrap sm:gap-4">
              <hgroup className="ml-auto space-y-1 text-end text-xs sm:text-sm">
                <p className="my-4 mb-4 flex flex-wrap justify-end text-lg font-semibold sm:my-0">
                  Total:&nbsp;
                  {totalDiscountedAmount !== totalAmount ? (
                    <>
                      <s
                        className="font-light text-muted-foreground"
                        aria-label="Total Amount"
                      >
                        {totalAmount}
                      </s>
                      &nbsp;
                      <em
                        className="not-italic"
                        aria-label="Discounted Total Amount"
                      >
                        {totalDiscountedAmount}
                      </em>
                    </>
                  ) : (
                    <span>{totalDiscountedAmount}</span>
                  )}
                </p>

                {order.invoicePdfUrl && (
                  <div className="flex flex-col items-end justify-end">
                    <span className="text-sm text-muted-foreground">
                      Download Invoice
                    </span>
                    <Button
                      href={order.invoicePdfUrl}
                      variant="link"
                      className="h-[40px] w-[40px] p-0 transition-opacity hover:opacity-50"
                      title="Click to download the invoice"
                    >
                      <Image
                        src="/pdf_icon.png"
                        alt="Invoice icon"
                        width={40}
                        height={40}
                        className="h-full w-full"
                      />
                      <span className="sr-only">Download an Invoice</span>
                    </Button>
                  </div>
                )}
                {!order.invoicePdfUrl && order.receiptUrl && (
                  <div className="my-2 translate-x-4">
                    <Link
                      href={order.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Click to view the receipt"
                      className="px-4 py-2 text-base text-muted-foreground underline underline-offset-2 transition-colors hover:text-black"
                    >
                      Receipt
                    </Link>
                  </div>
                )}

                <time
                  dateTime={order.createdAt.toUTCString()}
                  className="block text-muted-foreground"
                >
                  {format(order.createdAt, "dd MMM yyyy, HH:MM ", {
                    locale: pl,
                  })}
                </time>
                <h2 className="inline-flex flex-row flex-wrap justify-end gap-1 text-muted-foreground">
                  Order: <span className="">{order.id}</span>
                </h2>

                {!order.isPaid && (
                  <div>
                    <Button
                      variant="destructive"
                      aria-label="The order has not been paid."
                      title="The order has not been paid."
                      href={order.checkoutSessionUrl || ""}
                    >
                      Pay
                    </Button>
                  </div>
                )}
              </hgroup>

              <ul className="space-y-4">
                {order.orderItems.map((item, orderItemIndex) => (
                  <li key={item.id}>
                    <section className="flex flex-row items-center gap-4 sm:gap-8">
                      <ImageThumbnail
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        thumbnailContainerClassNames="bg-muted flex-shrink-0 rounded-lg"
                        containerClassNames="relative h-full w-full "
                        thumbnailContainerStyles={{ height: 125 }}
                      />

                      <div className="flex flex-grow flex-row flex-wrap justify-between">
                        <hgroup className="w-full space-y-1">
                          <div>
                            <h3 className="max-w-fit text-balance text-base font-semibold leading-6 underline-offset-4 transition-colors hover:text-muted-foreground hover:underline sm:text-lg">
                              <Link
                                href={`/products/${item.product.id}`}
                                className="outline-offset-4"
                              >
                                {item.product.name}
                              </Link>
                            </h3>
                            <p className="line-clamp-2 text-pretty text-sm sm:text-base">
                              {item.product.description}
                            </p>
                          </div>
                          <div className="flex w-full flex-row items-center justify-between gap-4 text-base font-semibold sm:text-lg">
                            <p
                              className="flex flex-wrap"
                              aria-label="Price for one piece"
                            >
                              {order.discountCode &&
                              order.discountCode.discountType ===
                                "PERCENTAGE" &&
                              order.discountCode?.products.find(
                                (product) => product.id === item.product.id
                              ) ? (
                                <>
                                  <s
                                    className="font-light text-muted-foreground"
                                    aria-label="Old price."
                                  >
                                    {formatCurrency(
                                      item.product.priceInCents / 100
                                    )}
                                  </s>
                                  &nbsp;
                                  <em
                                    className="not-italic"
                                    aria-label="Discounted price."
                                  >
                                    {formatCurrency(
                                      (item.product.priceInCents -
                                        (item.product.priceInCents *
                                          order.discountCode.discountAmount) /
                                          100) /
                                        100
                                    )}
                                  </em>
                                </>
                              ) : (
                                formatCurrency(item.product.priceInCents / 100)
                              )}
                            </p>
                            <p aria-label="Quantity">x{item.quantity}</p>
                          </div>
                        </hgroup>
                      </div>
                    </section>

                    {orderItemIndex < order.orderItems.length - 1 && (
                      <Separator className="mx-auto my-4 w-[95%]" />
                    )}
                  </li>
                ))}
              </ul>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
