"use server";

import Stripe from "stripe";
import type { DiscountCodeType } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

export async function getStripeProducts(
  params?: Stripe.ProductListParams,
  options?: Stripe.RequestOptions
) {
  try {
    return await stripe.products.list(params, options);
  } catch (error) {
    console.error(`Stripe failed to search for products. Error: ${error}`);
  }
}

export async function getAllStripeProductsByCategory(categories: string[]) {
  // Use a Set to store unique product IDs
  const productIdsSet = new Set<string>();
  let hasMore = true;
  let lastProductId = undefined;

  // Fetch all products from Stripe in batches of 100 (maximum limit)
  while (hasMore) {
    try {
      const stripeProducts = await getStripeProducts({
        active: true,
        limit: 100, // Stripe max limit
        ...(lastProductId && { starting_after: lastProductId }),
      });

      if (!stripeProducts) break;

      // Filter products that contain any of the provided categories
      const filteredProducts = stripeProducts.data.filter((product) => {
        const productCategories =
          product.metadata?.categories?.split(", ") || [];
        // Check if any of the searched categories are in the product's categories
        return categories.some((category) =>
          productCategories.includes(category)
        );
      });

      // Add IDs of filtered products to the Set (automatically removes duplicates)
      filteredProducts.forEach((product) => productIdsSet.add(product.id));

      hasMore = stripeProducts.has_more;
      lastProductId = stripeProducts.data[stripeProducts.data.length - 1]?.id;
    } catch (error) {
      console.error("Error fetching Stripe products:", error);
      break;
    }
  }

  // Convert Set to an array
  return Array.from(productIdsSet);
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

export async function createStripeCoupon(
  params?: Stripe.CouponCreateParams,
  options?: Stripe.RequestOptions
) {
  try {
    return await stripe.coupons.create(params, options);
  } catch (error) {
    console.error(`Stripe failed to create coupon. Error: ${error}`);
  }
}

export async function deleteStripeCoupon(
  id: string,
  params?: Stripe.CouponDeleteParams,
  options?: Stripe.RequestOptions
) {
  try {
    await stripe.coupons.del(id, params, options);
  } catch (error) {
    console.error(`Stripe failed to delete coupon. Error: ${error}`);
  }
}

export async function createStripePromotionCode(
  params: Stripe.PromotionCodeCreateParams,
  options?: Stripe.RequestOptions
) {
  try {
    return await stripe.promotionCodes.create(params, options);
  } catch (error) {
    console.error(`Stripe failed to create promotion code. Error: ${error}`);
  }
}

export async function createStripeDiscountCode(discountCode: {
  name: string;
  discountType: DiscountCodeType;
  discountAmount: number;
  products?: string[];
  redemptions?: number;
  expiresAt?: Date;
  metadata?: Record<string, string>;
}) {
  const {
    name,
    discountType,
    discountAmount,
    products,
    redemptions,
    expiresAt,
    metadata,
  } = discountCode;

  const expiresAtDate = expiresAt ? expiresAt.getTime() / 1000 : undefined; // Convert from milliseconds to seconds, as Stripe expects

  const coupon = await createStripeCoupon({
    name: name,
    amount_off: discountType === "FIXED" ? discountAmount : undefined,
    percent_off: discountType === "PERCENTAGE" ? discountAmount : undefined,
    currency: "pln",
    applies_to: {
      products: products && products.length >= 1 ? products : undefined,
    },
    max_redemptions: redemptions,
    redeem_by: expiresAtDate,
    metadata: metadata,
  });

  if (!coupon) return { error: "Failed to create coupon" };

  const promotionCode = await createStripePromotionCode({
    coupon: coupon.id,
    code: name,
    active: true,
    expires_at: expiresAtDate,
    max_redemptions: redemptions,
    metadata: metadata,
  });

  if (!promotionCode) return { error: "Failed to create promotion code" };

  return { coupon, promotionCode };
}

export async function createStripeCheckoutSession(
  customerId: string,
  orderId: string,
  products: {
    id: string;
    quantity: number;
  }[],
  discountCodeId?: string,
  invoiceData?: Stripe.Checkout.SessionCreateParams.InvoiceCreation.InvoiceData.CustomField[]
) {
  const lineItems: Stripe.PaymentLinkCreateParams.LineItem[] = [];

  for (const product of products) {
    const productData = await stripe.products.retrieve(product.id);

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
    // If `discountCodeId` is provided, apply the discount code
    discounts: discountCodeId
      ? [
          {
            coupon: discountCodeId,
          },
        ]
      : undefined,
    metadata: { orderIdInDB: orderId },
    submit_type: "pay",
  });

  return session;
}
