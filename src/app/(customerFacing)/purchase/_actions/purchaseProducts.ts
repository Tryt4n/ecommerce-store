"use server";

import { createOrEditUserWithOrder } from "@/db/userData/user";
import {
  createStripeCheckoutSession,
  createStripeCustomer,
} from "@/lib/stripe/stripe";

export async function handlePurchaseProduct(
  products: {
    productId: string;
    quantity: number;
    priceInCents: number;
  }[],
  prevState: unknown,
  formData: FormData
) {
  const email = formData.get("email") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;

  if (products.length === 0) {
    return "No products to purchase.";
  }
  if (products.length > 20) {
    return "Maximum of 20 products can be purchased at once.";
  }
  if (!email || email === "") {
    return "Email is required.";
  }

  // Create a new customer in Stripe - if the customer already exists, it will return the existing customer
  const customer = await createStripeCustomer({
    email: email,
    name:
      firstName || lastName
        ? `${firstName ? firstName : ""} ${lastName ? lastName : ""}`
        : undefined,
  });

  if (!customer) return "Failed to create Stripe customer.";

  const orderId = crypto.randomUUID();

  const user = await createOrEditUserWithOrder(
    customer.id,
    customer.email!,
    products,
    orderId
  );

  if (!user) return "Failed to create user.";

  // If the user was created successfully, create a new checkout session
  const checkoutSession = await createStripeCheckoutSession(
    user.id,
    products,
    orderId
  );

  return checkoutSession;
}
