import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components";
import OrderInformation from "./OrderInformation";
import type { Product } from "../types";
import type { DownloadVerification, Order } from "@prisma/client";

type OrderHistoryEmailProps = {
  orders: Array<
    Required<Pick<Order, "id" | "createdAt" | "pricePaidInCents">> & {
      downloadVerification: DownloadVerification;
      product: Product;
    }
  >;
};

// Only for preview purposes
OrderHistoryEmail.PreviewProps = {
  orders: [
    {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      pricePaidInCents: 10000,
      product: {
        name: "Product Name",
        imagePath:
          "/products/9a4116b0-82e7-46ac-b2a7-2cd2b318af80-05 - Metadata.jpg",
        description: "Product Description",
      },
      downloadVerification: {
        createdAt: new Date(),
        expiresAt: new Date(),
        id: crypto.randomUUID(),
        productId: crypto.randomUUID(),
      },
    },
    {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      pricePaidInCents: 20000,
      product: {
        name: "Second Product Name",
        imagePath:
          "/products/87e8bd8f-9359-4fa0-9251-cd3f1a1ac73a-06 - Loading & Errors.jpg",
        description: "Second Product Description",
      },
      downloadVerification: {
        createdAt: new Date(),
        expiresAt: new Date(),
        id: crypto.randomUUID(),
        productId: crypto.randomUUID(),
      },
    },
  ],
} satisfies OrderHistoryEmailProps;
// Only for preview purposes

export default function OrderHistoryEmail({ orders }: OrderHistoryEmailProps) {
  return (
    <Html>
      <Preview>Order History & Downloads</Preview>
      <Tailwind>
        <Head />

        <Body className="bg-white font-sans">
          <Container className="max-w-xl">
            <Heading>Order History</Heading>

            {orders.map((order, index) => (
              <React.Fragment key={order.id}>
                <OrderInformation
                  order={order}
                  product={order.product}
                  downloadVerification={order.downloadVerification}
                />

                {index < orders.length - 1 && <Hr />}
              </React.Fragment>
            ))}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
