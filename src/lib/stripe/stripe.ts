import Stripe from "stripe";
import type { MetadataParam } from "@stripe/stripe-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createStripePaymentIntent(
  amount: number,
  metadata: MetadataParam
) {
  try {
    return await stripe.paymentIntents.create({
      amount,
      currency: "PLN",
      metadata,
    });
  } catch (error) {
    console.error(`Stripe failed to create payment intent. Error: ${error}`);
  }
}
