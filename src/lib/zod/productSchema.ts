import { z } from "zod";

const fileSchema = z.instanceof(File, { message: "Please select a file." });
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/")
);

export const productAddSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(10),
  priceInCents: z.coerce.number().int().min(1),
  file: fileSchema.refine((file) => file.size > 0, {
    message: "Please select a file.",
  }),
  image: imageSchema.refine((file) => file.size > 0, {
    message: "Please select a image.",
  }),
});

export const editProductSchema = productAddSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional(),
});
