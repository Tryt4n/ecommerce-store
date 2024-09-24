import { z } from "zod";

const fileSchema = z.instanceof(File, { message: "Please select a file." });

export const productAddSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(10),
  priceInCents: z.coerce.number().int().min(1),
  file: fileSchema.refine((file) => file.size > 0, {
    message: "Please select a file.",
  }),
  images: z
    .array(z.string(), {
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

export const editProductSchema = productAddSchema.extend({
  file: fileSchema.optional(),
});
