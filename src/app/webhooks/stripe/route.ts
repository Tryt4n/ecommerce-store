import Stripe from "stripe";
import { NextResponse, type NextRequest } from "next/server";
import { getProduct } from "@/db/data";
import { createOrEditUser } from "@/db/user";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
  const event = stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  if (event.type === "charge.succeeded") {
    const charge = event.data.object;
    const productId = charge.metadata.productId;
    const email = charge.billing_details.email;
    const pricePaidInCents = charge.amount;

    const product = await getProduct(productId);

    if (!product || email == null) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    await createOrEditUser(email, productId, pricePaidInCents);
  }

  return new NextResponse();
}
