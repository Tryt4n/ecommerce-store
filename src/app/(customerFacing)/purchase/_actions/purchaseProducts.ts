"use server";

import { updateOrder } from "@/db/adminData/orders";
import { createOrEditUserWithOrder } from "@/db/userData/user";
import {
  createStripeCheckoutSession,
  createOrGetExistingStripeCustomer,
} from "@/lib/stripe/stripe";
import { purchaseSchema } from "@/lib/zod/purchaseSchema";

export async function handlePurchaseProduct(
  products: {
    productId: string;
    quantity: number;
    priceInCents: number;
  }[],
  prevState: unknown,
  formData: FormData
) {
  const email =
    formData.get("email") !== ""
      ? (formData.get("email") as string)
      : undefined;
  const firstName =
    formData.get("firstName") !== ""
      ? (formData.get("firstName") as string)
      : undefined;
  const lastName =
    formData.get("lastName") !== ""
      ? (formData.get("lastName") as string)
      : undefined;
  const createInvoice =
    (formData.get("invoice") as "on" | null) === "on" ? true : false;
  const companyName =
    formData.get("companyName") !== ""
      ? (formData.get("companyName") as string)
      : undefined;
  const companyStreet =
    formData.get("companyStreet") !== ""
      ? (formData.get("companyStreet") as string)
      : undefined;
  const companyStreetNumber =
    formData.get("companyStreetNumber") !== ""
      ? (formData.get("companyStreetNumber") as string)
      : undefined;
  const companyApartmentNumber =
    formData.get("companyApartmentNumber") !== ""
      ? (formData.get("companyApartmentNumber") as string)
      : undefined;
  const companyCity =
    formData.get("companyCity") !== ""
      ? (formData.get("companyCity") as string)
      : undefined;
  const companyZipCode =
    formData.get("companyZipCode") !== ""
      ? (formData.get("companyZipCode") as string)
      : undefined;
  const NIP =
    formData.get("NIP") !== "" ? (formData.get("NIP") as string) : undefined;

  const result = purchaseSchema.safeParse({
    products,
    email,
    firstName,
    lastName,
    createInvoice,
    companyName,
    companyStreet,
    companyStreetNumber,
    companyApartmentNumber,
    companyCity,
    companyZipCode,
    NIP,
  });

  if (result.success === false) {
    return { errors: result.error.formErrors.fieldErrors };
  }

  const { data: parsedData } = result;

  // Create a new customer in Stripe - if the customer already exists, it will return the existing customer
  const customer = await createOrGetExistingStripeCustomer({
    email: parsedData.email,
    name:
      parsedData.firstName || parsedData.lastName
        ? `${parsedData.firstName ? parsedData.firstName : ""} ${parsedData.lastName ? parsedData.lastName : ""}`
        : undefined,
  });

  // If the customer is not created/returned, return an error
  if (!customer)
    return { data: null, customError: "Failed to create Stripe customer." };

  // Create a new order ID to identify the order both in the database and in Stripe
  const orderId = crypto.randomUUID();

  // Create a new user or edit the existing one in the database and associate the order with the user
  const user = await createOrEditUserWithOrder(
    customer.id,
    customer.email!,
    parsedData.products,
    orderId
  );

  // If the user is not returned, return an error
  if (!user) return { data: null, customError: "Failed to create user." };

  // Create custom invoice fields
  const customInvoiceFields: Parameters<
    typeof createStripeCheckoutSession
  >["3"] = parsedData.createInvoice
    ? [
        {
          name: "Name",
          value: parsedData.companyName!,
        },
        // {
        //   name: "Address",
        //   value: `St. ${parsedData.companyStreet!} ${parsedData.companyStreetNumber!}${parsedData.companyApartmentNumber ? `, ${parsedData.companyApartmentNumber}` : ""}, ${parsedData.companyZipCode!} ${parsedData.companyCity!}`,
        // },
        {
          name: "Address",
          value: `St. ${parsedData.companyStreet!} ${parsedData.companyStreetNumber!}${parsedData.companyApartmentNumber ? `, ${parsedData.companyApartmentNumber}` : ""}`,
        },
        {
          name: "City",
          value: `${parsedData.companyZipCode!}, ${parsedData.companyCity!}`,
        },
      ]
    : undefined;
  if (
    parsedData.createInvoice &&
    customInvoiceFields &&
    parsedData.NIP &&
    parsedData.NIP !== ""
  )
    customInvoiceFields.push({ name: "NIP", value: parsedData.NIP });

  // If the user was created successfully, create a new checkout session
  const checkoutSession = await createStripeCheckoutSession(
    user.id,
    orderId,
    parsedData.products,
    parsedData.createInvoice ? customInvoiceFields : undefined // If the user wants an invoice, pass the custom fields
  );

  // Update the order with the checkout session URL
  const updatedOrder = await updateOrder(orderId, {
    checkoutSessionUrl: checkoutSession.url,
  });

  // If the order was not updated, return an error
  if (!updatedOrder)
    return {
      data: null,
      customError: "Failed to update order with checkout session URL.",
    };

  // Return the checkout session data
  return { data: checkoutSession };
}
