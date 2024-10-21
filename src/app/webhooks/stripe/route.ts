import Stripe from "stripe";
import { NextResponse, type NextRequest } from "next/server";
import db from "@/db/init";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
  try {
    const event = stripe.webhooks.constructEvent(
      await req.text(),
      req.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata?.orderIdInDB;

      if (!orderId) {
        return NextResponse.json(
          { error: "No orderIdInDB in metadata" },
          { status: 400 }
        );
      }

      try {
        await db.order.update({
          where: { id: orderId },
          data: { isPaid: true },
        });
      } catch (error) {
        console.error(`Failed to update order. Error: ${error}`);
        return NextResponse.json(
          { error: `Failed to update order: ${error}` },
          { status: 500 }
        );
      }

      // TODO: Create invoice email template with `invoice.url` and send it to the user
      // // Get Invoice
      // const invoice = await stripe.invoices.search({
      //   query: `metadata["orderIdInDB"]:"${orderId}"`,
      //   limit: 1,
      // });

      // // Send Invoice
      // invoice && (await stripe.invoices.sendInvoice(invoice.data[0].id));
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }
}
