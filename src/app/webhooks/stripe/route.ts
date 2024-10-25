import Stripe from "stripe";
import { NextResponse, type NextRequest } from "next/server";
import { updateOrder } from "@/db/adminData/orders";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
  try {
    const event = stripe.webhooks.constructEvent(
      await req.text(),
      req.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Delete the order if the checkout session is expired
    //! Code below make it to always return 200 status code - it should be refactored to run only when the order is unpaid
    // if (event.type === "checkout.session.expired") {
    //   const session = event.data.object;
    //   const orderId = (session as Stripe.Checkout.Session).metadata
    //     ?.orderIdInDB;

    //   try {
    //     await db.order.delete({
    //       where: { id: orderId },
    //     });
    //     return NextResponse.json({ received: true }, { status: 200 });
    //   } catch (error) {
    //     console.error("Failed to delete order.", error);
    //     return NextResponse.json(
    //       { error: `Failed to delete order: ${error}` },
    //       { status: 500 }
    //     );
    //   }
    // }

    // if (event.type === "checkout.session.async_payment_failed") {
    //   const session = event.data.object;
    //   const checkoutUrl = (session as Stripe.Checkout.Session).url;

    //   // TODO: send email to the user that the payment failed
    //   try {
    //     console.log(checkoutUrl);
    //     return NextResponse.json({ checkoutUrl: checkoutUrl }, { status: 200 }); //?
    //   } catch (error) {
    //     console.error(`Payment Failed. Error: ${error}`);
    //     return NextResponse.json(
    //       { error: `Payment Failed: ${error}` },
    //       { status: 500 }
    //     );
    //   }
    // }

    // if (event.type === "charge.succeeded") {
    //   const session = event.data.object as Stripe.Charge;
    //   session.metadata?.orderIdInDB;
    //   const receiptUrl = session.receipt_url;

    //   if (session.paid && receiptUrl) {
    //     orderUpdateDate.receiptUrl = receiptUrl;
    //   }

    //   return NextResponse.json({ received: true }, { status: 200 });
    // }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderIdInDB;
      const invoiceId = session.invoice;

      if (!orderId) {
        return NextResponse.json(
          { error: "No orderIdInDB in session checkout metadata" },
          { status: 400 }
        );
      }

      const orderUpdateDate = {
        isPaid: true,
        receiptUrl: null as null | string,
        invoiceUrl: null as null | string,
        invoicePdfUrl: null as null | string,
      };

      try {
        const invoice =
          invoiceId &&
          typeof invoiceId === "string" &&
          (await stripe.invoices.retrieve(invoiceId));

        if (invoice && invoice.hosted_invoice_url) {
          orderUpdateDate.invoiceUrl = invoice.hosted_invoice_url;
        }
        if (invoice && invoice.invoice_pdf) {
          orderUpdateDate.invoicePdfUrl = invoice.invoice_pdf;
        }

        await updateOrder(orderId, orderUpdateDate);

        return NextResponse.json({ received: true }, { status: 200 });
      } catch (error) {
        console.error(`Failed to update order. Error: ${error}`);
        return NextResponse.json(
          { error: `Failed to update order: ${error}` },
          { status: 500 }
        );
      }
    }

    // if (event.type === "invoice.created") {
    //   if (!customInvoiceData) return;
    //   try {
    //     const updatedInvoice = await stripe.invoices.update(
    //       event.data.object.id,
    //       {
    //         custom_fields: [
    //           {
    //             name: "Name",
    //             value: customInvoiceData.find((field) => field.key === "name")
    //               ?.text?.value as string,
    //           },
    //           {
    //             name: "Address",
    //             value: customInvoiceData.find(
    //               (field) => field.key === "address"
    //             )?.text?.value as string,
    //           },
    //           {
    //             name: "NIP",
    //             value: customInvoiceData.find((field) => field.key === "NIP")
    //               ?.numeric?.value as string,
    //           },
    //         ],
    //       }
    //     );

    //     return NextResponse.json({ invoice: updatedInvoice }, { status: 200 });
    //   } catch (error) {
    //     return NextResponse.json(
    //       { error: `Failed to update invoice: ${error}` },
    //       { status: 500 }
    //     );
    //   }
    // }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }
}
