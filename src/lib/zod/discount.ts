import { z } from "zod";
import { DiscountCodeType } from "@prisma/client";

export const addDiscountSchema = z
  .object({
    code: z
      .string()
      .min(5, { message: "Code must be at least 5 characters" })
      .max(40, { message: "Code must be less than 40 characters" })
      .refine((value) => !/\s/.test(value.trim()), {
        message: "Code cannot contain spaces",
      }),
    discountAmount: z.coerce.number().int().min(1),
    discountType: z.nativeEnum(DiscountCodeType),
    allProducts: z.coerce.boolean(),
    productIds: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
    expiresAt: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce.date().min(new Date()).optional(),
      { message: "Expires at must be in the future" }
    ),
    limit: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce.number().int().min(1).optional(),
      { message: "If you define limit it must be at least 1" }
    ),
  })
  .refine(
    (data) =>
      data.discountAmount <= 100 ||
      data.discountType !== DiscountCodeType.PERCENTAGE,
    {
      message: "Percentage discount must be less than or equal to 100%",
      path: ["discountAmount"],
    }
  )
  .refine((data) => !data.allProducts || data.productIds == null, {
    message: "Cannot select products when all products is selected",
    path: ["productIds"],
  })
  .refine((data) => data.allProducts || data.productIds != null, {
    message: "Must select products when all products is not selected",
    path: ["productIds"],
  });
