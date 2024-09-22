"use server";

import { getUser } from "@/db/userData/user";
import { getProduct } from "@/db/userData/products";
import { userOrderExist } from "@/db/userData/orders";
import { checkDiscountCode } from "@/db/userData/discountCodes";
import { emailSchema } from "@/lib/zod/emailSchema";
import { sendEmailWithOrderHistory } from "@/lib/resend/emails";
import { createDownloadVerification } from "./download";
import { getDiscountedAmount } from "@/lib/discountCodeHelpers";
import { createStripePaymentIntent } from "@/lib/stripe/stripe";
import type { DiscountCode, Product, User } from "@prisma/client";

export async function emailOrdersHistory(
  prevState: unknown,
  formData: FormData
): Promise<{ message?: string; error?: string }> {
  const result = emailSchema.safeParse(formData.get("email"));

  if (result.success === false) {
    return { error: "Invalid email address." };
  }

  const user = await getUser(result.data);
  const success_message =
    "Check your email to view your orders history and download your products.";

  if (user == null) {
    return {
      message: success_message,
    };
  }

  // Map orders to include downloadVerification promises
  const ordersWithPromises = user.orders.map(async (order) => {
    const downloadVerification = await createDownloadVerification(
      order.product.id
    );
    if (!downloadVerification) {
      throw new Error(
        `Download verification not found for product ${order.product.id}.`
      );
    }
    return {
      ...order,
      downloadVerification,
    };
  });

  // Wait for all promises to resolve
  const orders = await Promise.all(ordersWithPromises);

  const data = await sendEmailWithOrderHistory(user.email, orders);

  if (data?.error) {
    return {
      error: "There was an error sending your email. Please try again.",
    };
  }

  return { message: success_message };
}

export async function createPaymentIntent(
  email: User["email"],
  productId: Product["id"],
  discountCouponCode?: DiscountCode["code"]
) {
  const product = await getProduct(productId);
  if (!product) {
    return { error: "Unexpected Error." };
  }

  const discountCode =
    discountCouponCode &&
    (await checkDiscountCode(
      discountCouponCode,
      product.id,
      product.categories
    ));
  if (!discountCode == null && discountCouponCode != null) {
    return { error: "Coupon has expired." };
  }

  const existingOrder = await userOrderExist(email, productId);

  if (existingOrder) {
    return {
      error:
        "You have already purchased this product. Try downloading it from the My Orders page.",
    };
  }

  const amount = !discountCode
    ? product.priceInCents
    : getDiscountedAmount(
        discountCode.discountAmount,
        discountCode.discountType,
        product.priceInCents
      );

  const paymentIntent = await createStripePaymentIntent(amount, {
    productId: product.id,
    discountCodeId: (discountCode && discountCode?.id) || null,
  });
  if (!paymentIntent?.client_secret) {
    return { error: "Unknown error." };
  }

  return { clientSecret: paymentIntent.client_secret };
}
