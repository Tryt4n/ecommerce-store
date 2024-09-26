import { z } from "zod";

const uploadedImageSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  isMainForProduct: z.boolean().default(false),
});

const fileSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    url: z.string().url(),
  })
  .optional();

export const productAddSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(10),
  priceInCents: z.coerce.number().int().min(1),
  productFile: fileSchema,
  images: z
    .array(uploadedImageSchema, {
      message: "Upload at least one image for the product.",
    })
    .nonempty(),
  categories: z
    .array(z.string(), {
      message: "You must select at least one category for the product.",
    })
    .nonempty()
    .max(3),
});
