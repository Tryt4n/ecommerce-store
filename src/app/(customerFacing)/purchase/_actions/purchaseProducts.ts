"use server";

import { getDiscountCode } from "@/db/adminData/discountCodes";
import { updateOrder } from "@/db/adminData/orders";
import { createOrEditUserWithOrder } from "@/db/userData/user";
import {
  createStripeCheckoutSession,
  createOrGetExistingStripeCustomer,
} from "@/lib/stripe/stripe";
import { purchaseSchema } from "@/lib/zod/purchaseSchema";
import type { ShoppingCart } from "@/types/shoppingCart";

export async function handlePurchaseProduct(
  products: ShoppingCart,
  prevState: unknown,
  formData: FormData
) {
  const email = getFormValue(formData, "email");
  const firstName = getFormValue(formData, "firstName");
  const lastName = getFormValue(formData, "lastName");
  const createInvoice = formData.get("invoice") === "on";
  const companyName = getFormValue(formData, "companyName");
  const companyStreet = getFormValue(formData, "companyStreet");
  const companyStreetNumber = getFormValue(formData, "companyStreetNumber");
  const companyApartmentNumber = getFormValue(
    formData,
    "companyApartmentNumber"
  );
  const companyCity = getFormValue(formData, "companyCity");
  const companyZipCode = getFormValue(formData, "companyZipCode");
  const NIP = getFormValue(formData, "NIP");
  const discountCode = getFormValue(formData, "discountCode");

  const result = purchaseSchema.safeParse({
    products,
    email,
    firstName,
    lastName,
    discountCode,
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
  >["4"] = parsedData.createInvoice
    ? [
        {
          name: "Name",
          value: parsedData.companyName!,
        },
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

  // Get the discount code from the database
  const discountCodeDB = discountCode
    ? await getDiscountCode(discountCode)
    : undefined;

  // If the user was created successfully, create a new checkout session
  const checkoutSession = await createStripeCheckoutSession(
    user.id,
    orderId,
    parsedData.products,
    discountCodeDB?.id,
    parsedData.createInvoice ? customInvoiceFields : undefined // If the user wants an invoice, pass the custom fields
  );

  // Prepare the data to update the order in the database
  const orderDataToUpdateInDB: Parameters<typeof updateOrder>["1"] = {
    checkoutSessionUrl: checkoutSession.url,
    discountCode: {
      connect: { id: discountCodeDB?.id },
    },
  };
  if (discountCode && checkoutSession.amount_total)
    orderDataToUpdateInDB.pricePaidInCents = checkoutSession.amount_total;

  // Update the order with the checkout session URL and connected discount code
  const updatedOrder = await updateOrder(orderId, orderDataToUpdateInDB);

  // If the order was not updated, return an error
  if (!updatedOrder)
    return {
      data: null,
      customError: "Failed to update order with checkout session URL.",
    };

  // Return the checkout session data
  return { data: checkoutSession };
}

function getFormValue(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  // Return undefined if the value is null or an empty string
  return value && value !== "" ? (value as string) : undefined;
}
