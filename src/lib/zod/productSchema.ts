import { z } from "zod";

const uploadedImageSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  isMainForProduct: z.boolean().default(false),
});

const fileSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(3, { message: "File name is too short. Min 3 characters." })
    .max(255, { message: "File name is too long. Max 255 characters." }),
  url: z.string().url(),
});

export const productAddSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  description: z
    .string()
    .min(10, { message: "Please provide a valid description." }),
  priceInCents: z.coerce
    .number()
    .int({ message: "Please provide valid price." })
    .min(1, { message: "Price can't be less than 1." }),
  productFile: fileSchema.optional(),
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
    .max(3, { message: "You can only select up to 3 categories." }),
});
