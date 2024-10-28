import { z } from "zod";

export const purchaseSchema = z
  .object({
    products: z
      .array(
        z.object({
          productId: z.string().min(1, { message: "Invalid product ID." }),
          quantity: z
            .number({ message: "Quantity must be a number." })
            .int({ message: "Quantity must be a whole number." })
            .min(1, { message: "The minimum quantity for this product is 1." })
            .max(99, {
              message: "The maximum quantity for this product is 99.",
            }),
          priceInCents: z
            .number({ message: "Price must be a number." })
            .int({ message: "Price must be a whole number." })
            .min(1, { message: "Price must be a positive number." })
            .max(999999, { message: "Price must be at most 999999." }),
        })
      )
      .nonempty({ message: "No products to purchase." })
      .max(20, { message: "Maximum of 20 products can be purchased at once." }),
    email: z.string().email({ message: "Invalid email address." }),
    firstName: z.string({ message: "Invalid first name." }).min(3).optional(),
    lastName: z.string({ message: "Invalid last name." }).min(3).optional(),
    createInvoice: z.boolean({ message: "Invalid invoice creation flag." }),
    companyName: z
      .string()
      .min(5, { message: "Name must be at least 5 characters long." })
      .max(100, { message: "Name must be at most 100 characters long." })
      .optional()
      .transform((value) => {
        if (!value) return value;
        // Normalize street name:
        // - replace multiple spaces with single space
        // - ensure exactly one space after dots in initials
        // - trim any leading/trailing spaces
        return value
          .trim()
          .replace(/\.(?!\s)/g, ". ")
          .replace(/\s+/g, " ");
      })
      .superRefine((value, ctx) => {
        if (!value) return;

        // Check if the name contains only allowed characters
        // \p{L} - all letters (including diacritics)
        // \d - numbers
        // Special characters listed as a class
        const nameRegex = /^[\p{L}\d\s.,\-_/\\|:'"()\[\]]+$/u;

        if (!nameRegex.test(value)) {
          ctx.addIssue({
            code: "custom",
            message:
              "Company name can only contain letters, numbers, and the following special characters: space . , - _ / \\ | : ' \" ( ) [ ]",
          });
          return;
        }

        // Check the minimum length without whitespace
        const nameLength = value.replace(/\s/g, "").length;
        if (nameLength < 5) {
          ctx.addIssue({
            code: "custom",
            message:
              "Company name must be at least 5 characters long (excluding spaces).",
          });
          return;
        }
      }),
    companyStreet: z
      .string()
      .min(3, { message: "Street must be at least 3 characters long." })
      .max(80, { message: "Street must be at most 80 characters long." })
      .optional()
      .transform((value) => {
        if (!value) return value;
        // Normalize street name:
        // - replace multiple spaces with single space
        // - ensure exactly one space after dots in initials
        // - trim any leading/trailing spaces
        return value
          .trim()
          .replace(/\.(?!\s)/g, ". ")
          .replace(/\s+/g, " ");
      })
      .superRefine((value, ctx) => {
        if (!value) return;

        // Check minimum length without spaces, hyphens and dots
        const streetLength = value.replace(/[\s\-.]/g, "").length;
        if (streetLength < 3) {
          ctx.addIssue({
            code: "custom",
            message:
              "Street name must be at least 3 characters long (excluding spaces, hyphens and dots).",
          });
        }

        // Check the street format
        // Unicode categories for letters:
        // \p{L} - every letter from any language
        // \p{Lu} - uppercase letters
        // \p{Ll} - lowercase letters
        const streetRegex =
          /^(?:(?:\p{Lu}\.\s+){1,2})?[\p{L}0-9]+(?:[\s-][\p{L}0-9]+)*$/u;

        if (!streetRegex.test(value)) {
          ctx.addIssue({
            code: "custom",
            message:
              "Invalid street format. Can be a single or multi-part name, optionally starting with initials (e.g. J. or J. J.), parts separated by space or hyphen.",
          });
          return;
        }
      }),
    companyStreetNumber: z
      .string()
      .min(1, { message: "Street number must be at least 1 character long." })
      .max(10, { message: "Street number must be at most 10 characters long." })
      .optional()
      .transform((value) => {
        if (!value) return value;
        // Normalize street number (remove spaces)
        return value.trim();
      })
      .superRefine((value, ctx) => {
        if (!value) return;

        // Regex pattern for street number:
        // - Starts with a number
        // - Optionally it can have up to 2 letters after the number
        // - Cannot end with a space or a dash.
        const streetNumberRegex = /^\d+[A-Za-z]{0,2}$/;

        // If the number contains a slash (e.g. "12/2", "12A/2")
        const streetNumberWithSlashRegex = /^\d+[A-Za-z]{0,2}\/\d+$/;

        if (
          !streetNumberRegex.test(value) &&
          !streetNumberWithSlashRegex.test(value)
        ) {
          ctx.addIssue({
            code: "custom",
            message:
              "Invalid street number format. Examples of valid formats: 1, 12, 12A, 12BC, 12/2, 12A/2",
          });
          return;
        }
      }),
    companyApartmentNumber: z
      .string()
      .min(1, {
        message: "Apartment number must be at least 1 character long.",
      })
      .max(10, {
        message: "Apartment number must be at most 10 characters long.",
      })
      .optional()
      .transform((value) => {
        if (!value) return value;
        // Normalize street number (remove spaces)
        return value.trim();
      })
      .superRefine((value, ctx) => {
        if (!value) return;

        // Regex pattern for apartment number:
        // - Can start with a number with optional letters
        // - Or it can be in number/number format
        // - It cannot end with a space or a dash.
        const apartmentNumberRegex = /^(?:\d+[A-Za-z]{0,2}|\d+\/\d+)$/;

        if (!apartmentNumberRegex.test(value)) {
          ctx.addIssue({
            code: "custom",
            message:
              "Invalid apartment number format. Examples of valid formats: 1, 12, 12A, 12B, 12/2",
          });
          return;
        }
      }),
    companyCity: z
      .string()
      .min(3, { message: "City must be at least 3 characters long." })
      .max(50, { message: "City must be at most 50 characters long." })
      .optional()
      .transform((value) => {
        if (!value) return value;
        // Normalize city name:
        // - replace multiple spaces with single space
        // - ensure exactly one space after dots in initials
        // - trim any leading/trailing spaces
        return value
          .trim()
          .replace(/\.(?!\s)/g, ". ")
          .replace(/\s+/g, " ");
      })
      .superRefine((value, ctx) => {
        if (!value) return;

        // Check minimum length without spaces, hyphens and dots
        const cityLength = value.replace(/[\s\-.]/g, "").length;
        if (cityLength < 3) {
          ctx.addIssue({
            code: "custom",
            message:
              "City name must be at least 3 characters long (excluding spaces, hyphens and dots).",
          });
        }

        // Check the city format
        // Pattern supports:
        // 1. Optional starting initials: ((?:\p{Lu}\.){1,2}\s+)?
        // 2. The main part of the city's name: [\p{L}0-9]+
        // 3. Optional additional members: (?:[\s-][\p{L}0-9]+)*
        const cityRegex =
          /^(?:(?:\p{Lu}\.\s+){1,2})?[\p{L}0-9]+(?:[\s-][\p{L}0-9]+)*$/u;

        if (!cityRegex.test(value)) {
          ctx.addIssue({
            code: "custom",
            message:
              "Invalid city format. Can be a single or multi-part name, optionally starting with initials (e.g. D. or D.D.), parts separated by space or hyphen.",
          });
          return;
        }
      }),
    companyZipCode: z
      .string()
      .min(3, { message: "Zip code must be at least 3 characters long." })
      .max(6, { message: "Zip code must be at most 6 characters long." })
      .optional()
      .transform((value) => {
        if (!value) return value;
        // Normalize zip code (remove spaces)
        return value.trim().replace(/\s+/g, "");
      })
      .superRefine((value, ctx) => {
        if (!value) return;

        // Check the zip code format
        const zipRegex = /^\d{2}(?:-| )?\d{3}$/;
        if (!zipRegex.test(value)) {
          ctx.addIssue({
            code: "custom",
            message:
              "Invalid zip code format. Must be in format: 12345, 12-345 or 12 345.",
          });
          return;
        }
      }),
    NIP: z
      .string()
      .optional()
      .transform((value) => {
        if (!value) return value;
        // Normalize NIP (remove spaces)
        return value.trim();
      })
      .superRefine((value, ctx) => {
        if (!value) return;

        if (value.length !== 10) {
          ctx.addIssue({
            code: "custom",
            message: "NIP must be exactly 10 characters long.",
          });
        }

        if (!/^\d+$/.test(value)) {
          ctx.addIssue({
            code: "custom",
            message: "NIP must contain only digits (0-9).",
          });
        }
      }),
  })
  .superRefine((data, ctx) => {
    if (data.createInvoice) {
      if (!data.companyName) {
        ctx.addIssue({
          code: "custom",
          message: "Company name is required when creating an invoice.",
          path: ["companyName"],
        });
      }
      if (!data.companyStreet) {
        ctx.addIssue({
          code: "custom",
          message: "Street is required when creating an invoice.",
          path: ["companyStreet"],
        });
      }
      if (!data.companyStreetNumber) {
        ctx.addIssue({
          code: "custom",
          message: "Street number is required when creating an invoice.",
          path: ["companyStreetNumber"],
        });
      }
      if (!data.companyCity) {
        ctx.addIssue({
          code: "custom",
          message: "City is required when creating an invoice.",
          path: ["companyCity"],
        });
      }
      if (!data.companyZipCode) {
        ctx.addIssue({
          code: "custom",
          message: "Zip code is required when creating an invoice.",
          path: ["companyZipCode"],
        });
      }
    }
  });
