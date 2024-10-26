"use server";

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

export async function createOrGetExistingStripeCustomer(
  params: Stripe.CustomerCreateParams,
  options?: Stripe.RequestOptions
) {
  try {
    const customer = await stripe.customers.search({
      query: `email:'${params.email}'`,
    });

    if (customer.data.length >= 1) {
      return customer.data[0];
    } else {
      return await stripe.customers.create(params, options);
    }
  } catch (error) {
    console.error(`Stripe failed to create customer. Error: ${error}`);
  }
}

export async function createStripeProduct(
  params: Stripe.ProductCreateParams,
  options?: Stripe.RequestOptions
) {
  try {
    return await stripe.products.create(params, options);
  } catch (error) {
    console.error(`Stripe failed to create product. Error: ${error}`);
  }
}

export async function updateStripeProduct(
  productId: string,
  params: Partial<Stripe.ProductUpdateParams>,
  options?: Stripe.RequestOptions
) {
  try {
    return await stripe.products.update(productId, params, options);
  } catch (error) {
    console.error(`Stripe failed to update product. Error: ${error}`);
  }
}

export async function deleteStripeProduct(productId: string) {
  // Stripe API does not allow deleted product when it has any connections with prices so we need to update the product to inactive
  try {
    await stripe.products.update(productId, {
      active: false,
      metadata: {
        status: "deleted",
        deleted_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(`Stripe failed to delete product. Error: ${error}`);
  }
}

export async function createStripePrice(
  params: Stripe.PriceCreateParams,
  options?: Stripe.RequestOptions
) {
  try {
    return await stripe.prices.create(params, options);
  } catch (error) {
    console.error(`Stripe failed to create price. Error: ${error}`);
  }
}

export async function searchForExistingStripePrice(
  params: Stripe.PriceSearchParams,
  options?: Stripe.RequestOptions
) {
  try {
    return await stripe.prices.search(params, options);
  } catch (error) {
    console.error(
      `Stripe failed to search for existing price. Error: ${error}`
    );
  }
}

export async function searchForStripeInvoice(
  params: Stripe.InvoiceSearchParams,
  options?: Stripe.RequestOptions
) {
  try {
    return await stripe.invoices.search(params, options);
  } catch (error) {
    console.error(`Stripe failed to search for invoice. Error: ${error}`);
  }
}

export async function createStripeCheckoutSession(
  customerId: string,
  orderId: string,
  products: {
    productId: string;
    quantity: number;
  }[],
  invoiceData?: Stripe.Checkout.SessionCreateParams.InvoiceCreation.InvoiceData.CustomField[]
) {
  const lineItems: Stripe.PaymentLinkCreateParams.LineItem[] = [];

  for (const product of products) {
    const productData = await stripe.products.retrieve(product.productId);

    lineItems.push({
      price: productData.default_price as string,
      quantity: product.quantity,
      adjustable_quantity: {
        enabled: false,
      },
    });
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    customer_update: {
      address: "auto",
      name: "auto",
      shipping: "auto",
    },
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/purchase/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/orders`,
    line_items: lineItems,
    mode: "payment",
    billing_address_collection: "required",
    payment_method_types: ["card", "blik", "p24", "paypal"],
    currency: "pln",
    automatic_tax: {
      enabled: true,
      liability: {
        type: "self",
      },
    },
    // Create invoice if invoiceData is provided
    invoice_creation: invoiceData && {
      enabled: true,
      invoice_data: {
        rendering_options: { amount_tax_display: "include_inclusive_tax" },
        metadata: { orderIdInDB: orderId },
        custom_fields: invoiceData,
      },
    },
    metadata: { orderIdInDB: orderId },
    submit_type: "pay",
  });

  return session;
}
