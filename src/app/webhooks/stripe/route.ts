import Stripe from "stripe";
import { NextResponse, type NextRequest } from "next/server";
import { deleteOrder, updateOrder } from "@/db/adminData/orders";
import {
  getDiscountCode,
  updateDiscountCode,
} from "@/db/adminData/discountCodes";
import { sendPurchaseEmail } from "@/lib/resend/emails";
import type { Order } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
  try {
    const event = stripe.webhooks.constructEvent(
      await req.text(),
      req.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Delete the order if the checkout session is expired
    if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderIdInDB;

      if (!orderId) {
        return NextResponse.json(
          { error: "No orderIdInDB in session checkout metadata" },
          { status: 400 }
        );
      }

      // Delete the order from the database
      await deleteOrder(orderId);

      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Update the order if the checkout session is completed
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderIdInDB;

      if (!orderId) {
        return NextResponse.json(
          { error: "No orderIdInDB in session checkout metadata" },
          { status: 400 }
        );
      }

      // Prepare the data to update the order in the database
      const orderUpdateDate: Partial<Order> = {
        isPaid: true,
        receiptUrl: null as null | string,
        invoicePdfUrl: null as null | string,
        checkoutSessionUrl: null,
      };

      try {
        // Retrieve the PaymentIntent from the session
        const paymentIntent = await stripe.paymentIntents.retrieve(
          session.payment_intent as string,
          {
            expand: ["latest_charge"], // Expand the latest_charge field
          }
        );

        // Get the receipt URL from the expanded charge
        if (
          paymentIntent.latest_charge &&
          typeof paymentIntent.latest_charge !== "string"
        ) {
          orderUpdateDate.receiptUrl = paymentIntent.latest_charge.receipt_url;
        }

        // If the invoice exist get the download PDF URL from the session
        const invoiceId = session.invoice;
        const invoice =
          invoiceId &&
          typeof invoiceId === "string" &&
          (await stripe.invoices.retrieve(invoiceId));

        invoice &&
          invoice?.invoice_pdf &&
          (orderUpdateDate.invoicePdfUrl = invoice.invoice_pdf);

        // Update the order in the database
        const order = await updateOrder(orderId, orderUpdateDate);

        // Send the purchase email
        order && (await sendPurchaseEmail(order.user.email, order));

        return NextResponse.json({ received: true }, { status: 200 });
      } catch (error) {
        console.error(`Failed to update order. Error: ${error}`);
        return NextResponse.json(
          { error: `Failed to update order: ${error}` },
          { status: 500 }
        );
      }
    }

    // Update discount code usage if a discount is used
    if (event.type === "customer.discount.created") {
      const sessionDiscount = event.data.object as Stripe.Discount;

      const discountCode = sessionDiscount.coupon.name
        ? await getDiscountCode(sessionDiscount.coupon.name)
        : null;

      // Update the discount code usage in the database
      if (discountCode) {
        await updateDiscountCode(discountCode.id, {
          uses: { increment: 1 },
        });
      }

      return NextResponse.json({ received: true }, { status: 200 });
    }
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }
}
