import { Resend } from "resend";
import PurchaseReceiptEmail from "./templates/PurchaseReceiptEmail";
import type { updateOrder } from "@/db/adminData/orders";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPurchaseEmail(
  email: string,
  order: NonNullable<Awaited<ReturnType<typeof updateOrder>>>
) {
  try {
    await resend.emails.send({
      from: `E-commerce Store <${process.env.RESEND_FROM_EMAIL}>`,
      to: email,
      subject: "Your purchase is complete!",
      react: <PurchaseReceiptEmail order={order} />,
    });
  } catch (error) {
    console.error(`Can't send email. Error: ${error}`);
  }
}
