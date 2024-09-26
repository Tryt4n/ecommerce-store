import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components";
import OrderInformation from "./OrderInformation";
import type { Order } from "../types";
import type { DownloadVerification } from "@prisma/client";
import type { getProduct } from "@/db/userData/products";

export type PurchaseReceiptEmailProps = {
  product: Required<
    Pick<
      NonNullable<Awaited<ReturnType<typeof getProduct>>>,
      "name" | "description" | "images"
    >
  >;
  order: Order;
  downloadVerification: DownloadVerification;
};

// Only for preview purposes
PurchaseReceiptEmail.PreviewProps = {
  product: {
    name: "Product Name",
    images: [
      {
        id: "1",
        url: "/products/9a4116b0-82e7-46ac-b2a7-2cd2b318af80-05 - Metadata.jpg",
      },
    ],
    description: "Product Description",
  },
  order: {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    pricePaidInCents: 10000,
  },
  downloadVerification: {
    createdAt: new Date(),
    expiresAt: new Date(),
    id: crypto.randomUUID(),
    productId: crypto.randomUUID(),
  },
} satisfies PurchaseReceiptEmailProps;
// Only for preview purposes

export default function PurchaseReceiptEmail({
  product,
  order,
  downloadVerification,
}: PurchaseReceiptEmailProps) {
  return (
    <Html>
      <Preview>Download {product.name} and view receipt.</Preview>
      <Tailwind>
        <Head />

        <Body className="bg-white font-sans">
          <Container className="max-w-xl">
            <Heading>Purchase Receipt</Heading>

            <OrderInformation
              product={product}
              order={order}
              downloadVerification={downloadVerification}
            />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
