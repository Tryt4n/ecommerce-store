import React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Tailwind,
} from "@react-email/components";
import OrderInformation from "../components/OrderInformation";
import type { updateOrder } from "@/db/adminData/orders";

export type PurchaseReceiptEmailProps = {
  order: NonNullable<Awaited<ReturnType<typeof updateOrder>>>;
};

// Only for preview purposes
PurchaseReceiptEmail.PreviewProps = {
  order: {
    id: crypto.randomUUID(),
    receiptUrl: "https://example.com/receipt",
    createdAt: new Date(),
    pricePaidInCents: 37997,
    user: { email: "test@test.com" },
    orderItems: [
      {
        id: "1",
        product: {
          name: "First Product",
          priceInCents: 9499,
          description:
            "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Perspiciatis, magni fugiat minima laboriosam obcaecati placeat est dicta eveniet dolore ratione pariatur cumque adipisci sapiente facere error impedit nihil quod? Placeat repudiandae repellendus in.",
          images: [
            {
              url: "https://ik.imagekit.io/tfmnhfl9v/Products/Wireless_Security_Doorbell/blink-video-doorbell-czarny_131490944921_5__6__ZnNtOjvKj.webp?updatedAt=1728724366604",
            },
          ],
        },
        quantity: 2,
      },
      {
        id: "2",
        product: {
          name: "Second Product",
          priceInCents: 18999,
          description:
            "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Perspiciatis, magni fugiat minima laboriosam obcaecati placeat est dicta eveniet dolore ratione pariatur cumque adipisci sapiente facere error impedit nihil quod? Placeat repudiandae repellendus in.",
          images: [
            {
              url: "https://ik.imagekit.io/tfmnhfl9v/Products/Ergonomic_Office_Chair/Fotel-DIABLO-CHAIRS-V-Light-Czarny-tyl_i0Y8maFkX.jpg?updatedAt=1728724313297",
            },
          ],
        },
        quantity: 1,
      },
    ],
  },
} satisfies PurchaseReceiptEmailProps;
// Only for preview purposes

export default function PurchaseReceiptEmail({
  order,
}: PurchaseReceiptEmailProps) {
  return (
    <Html>
      <Tailwind>
        <Head />

        <Body className="bg-white font-sans">
          <Container className="max-w-xl">
            <Heading className="mb-0 flex justify-between text-lg font-medium">
              <span>Purchase Receipt</span>
              <Img
                src="https://ik.imagekit.io/tfmnhfl9v/Logo/logo.svg"
                alt="E-commerce store logo"
                width="50"
                height="50"
              />
            </Heading>

            <OrderInformation order={order} />
          </Container>

          <div className="flex flex-row justify-center">
            <Button
              href={`${order.receiptUrl}`}
              className="mx-auto mb-4 mt-8 rounded bg-black px-6 py-4 text-lg text-white"
            >
              Show Receipt
            </Button>
          </div>
        </Body>
      </Tailwind>
    </Html>
  );
}
