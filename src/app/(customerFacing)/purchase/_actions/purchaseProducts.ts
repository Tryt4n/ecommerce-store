"use server";

import { updateOrder } from "@/db/adminData/orders";
import { createOrEditUserWithOrder } from "@/db/userData/user";
import {
  createStripeCheckoutSession,
  createOrGetExistingStripeCustomer,
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
  const createInvoice = formData.get("invoice") as "on" | null;
  const companyName = formData.get("companyName") as string;
  const companyAddress = formData.get("companyAddress") as string;
  const NIP = formData.get("NIP") as string;

  // Check if the order is valid - if not, return an error
  if (products.length === 0) {
    return { data: null, error: "No products to purchase." };
  }
  if (products.length > 20) {
    return {
      data: null,
      error: "Maximum of 20 products can be purchased at once.",
    };
  }
  if (!email || email === "") {
    return { data: null, error: "Email is required." };
  }

  // Create a new customer in Stripe - if the customer already exists, it will return the existing customer
  const customer = await createOrGetExistingStripeCustomer({
    email: email,
    name:
      firstName || lastName
        ? `${firstName ? firstName : ""} ${lastName ? lastName : ""}`
        : undefined,
  });

  // If the customer is not created/returned, return an error
  if (!customer)
    return { data: null, error: "Failed to create Stripe customer." };

  // Create a new order ID to identify the order both in the database and in Stripe
  const orderId = crypto.randomUUID();

  // Create a new user or edit the existing one in the database and associate the order with the user
  const user = await createOrEditUserWithOrder(
    customer.id,
    customer.email!,
    products,
    orderId
  );

  // If the user is not returned, return an error
  if (!user) return { data: null, error: "Failed to create user." };

  // Create custom invoice fields
  const customInvoiceFields: Parameters<
    typeof createStripeCheckoutSession
  >["3"] =
    createInvoice === "on"
      ? [
          {
            name: "Name",
            value: companyName,
          },
          {
            name: "Address",
            value: companyAddress,
          },
        ]
      : undefined;
  if (createInvoice === "on" && customInvoiceFields && NIP && NIP !== "")
    customInvoiceFields.push({ name: "NIP", value: NIP });

  // If the user was created successfully, create a new checkout session
  const checkoutSession = await createStripeCheckoutSession(
    user.id,
    orderId,
    products,
    createInvoice === "on" ? customInvoiceFields : undefined // If the user wants an invoice, pass the custom fields
  );

  // Update the order with the checkout session URL
  const updatedOrder = await updateOrder(orderId, {
    checkoutSessionUrl: checkoutSession.url,
  });

  // If the order was not updated, return an error
  if (!updatedOrder)
    return {
      data: null,
      error: "Failed to update order with checkout session URL.",
    };

  // Return the checkout session data
  return { data: checkoutSession, error: null };
}
