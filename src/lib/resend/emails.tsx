import { Resend } from "resend";
import PurchaseReceiptEmail from "./templates/PurchaseReceiptEmail";
import OrderHistoryEmail from "./templates/OrderHistoryEmail";
import type { Order, Product } from "./types";
import type { DownloadVerification } from "@prisma/client";
import type { ComponentProps } from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPurchaseEmail(
  email: string,
  order: Order,
  product: Product,
  downloadVerification: DownloadVerification
) {
  try {
    await resend.emails.send({
      from: `Suport <${process.env.RESEND_FROM_EMAIL}>`,
      to: email,
      subject: "Your purchase is complete!",
      react: (
        <PurchaseReceiptEmail
          order={order}
          product={product}
          downloadVerification={downloadVerification}
        />
      ),
    });
  } catch (error) {
    console.log(`Can't send email. Error: ${error}`);
  }
}

export async function sendEmailWithOrderHistory(
  email: string,
  orders: ComponentProps<typeof OrderHistoryEmail>["orders"]
) {
  try {
    return await resend.emails.send({
      from: `Suport <${process.env.RESEND_FROM_EMAIL}>`,
      to: email,
      subject: "Order History",
      react: <OrderHistoryEmail orders={orders} />,
    });
  } catch (error) {
    console.log(`Can't send email. Error: ${error}`);
  }
}
