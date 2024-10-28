"use server";

import { notFound, redirect } from "next/navigation";
import {
  createStripePrice,
  createStripeProduct,
  deleteStripeProduct,
  searchForExistingStripePrice,
  updateStripeProduct,
} from "@/lib/stripe/stripe";
import {
  createProduct as createProductInDB,
  updateProduct as updateProductInDB,
  deleteProduct as deleteProductInDB,
} from "@/db/adminData/products";
import { productAddSchema } from "@/lib/zod/productSchema";
import { getProduct } from "@/db/userData/products";
import type { FormDataEntries } from "@/types/formData";
import type Stripe from "stripe";

export async function addProduct(prevState: unknown, formData: FormData) {
  const processedData = processFormData(formData);
  const { data, error } = validateAndParseData(processedData);

  if (error) return error;

  // Prepare metadata for the product
  const productMetadata: {
    categories: string;
    productFileName?: string;
    productFileUrl?: string;
  } = {
    categories: data.categories.join(", "),
  };
  if (data.productFile) {
    productMetadata.productFileName = data.productFile.name;
    productMetadata.productFileUrl = data.productFile.url;
  }

  // Create a product in Stripe
  const product = await createStripeProduct({
    name: data.name,
    description: data.description,
    active: true,
    default_price_data: {
      currency: "pln",
      unit_amount: data.priceInCents,
    },
    images: data.images.map((image) => image.url),
    metadata: productMetadata,
  });

  if (!product) return;

  // Create a product in the database with stripe product id
  await createProductInDB({ ...data, id: product.id }).then(() => {
    redirect("/admin/products");
  });
}

export async function updateProduct(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const processedData = processFormData(formData);
  const { data, error } = validateAndParseData(processedData);

  if (error) return error;

  const product = await getProduct(id);

  if (product == null) return notFound();

  let updatedProduct: Awaited<ReturnType<typeof updateStripeProduct>>;
  // Update product in Stripe if needed
  if (
    product.name !== data.name ||
    product.description !== data.description ||
    product.priceInCents !== data.priceInCents ||
    product.categories.join(", ").toLowerCase() !==
      data.categories.join(", ").toLowerCase() ||
    (product.productFile &&
      data.productFile &&
      product.productFile.name !== data.productFile.name) ||
    (product.productFile &&
      data.productFile &&
      product.productFile.url !== data.productFile.url) ||
    product.images.length !== data.images.length ||
    !areImagesEqual(product.images, data.images)
  ) {
    // Prepare metadata for the product
    const productMetadata: {
      categories: string;
      productFileName?: string;
      productFileUrl?: string;
    } = {
      categories: data.categories.join(", "),
    };
    if (data.productFile) {
      productMetadata.productFileName = data.productFile.name;
      productMetadata.productFileUrl = data.productFile.url;
    }

    // Prepare params for the Stripe product update
    const searchedStripeProductParams: Partial<Stripe.ProductUpdateParams> = {
      name: data.name,
      description: data.description,
      images: data.images.map((image) => image.url),
      metadata: productMetadata,
    };

    // Update price in Stripe if needed
    if (product.priceInCents !== data.priceInCents) {
      // Search for existing price in Stripe
      const searchedStripePrice = await searchForExistingStripePrice({
        query: `product:'${product.id}'`,
        limit: 1,
      });

      // If price exists, use it, otherwise create a new one and add it to `searchedStripeProductParams`
      if (searchedStripePrice?.data[0].unit_amount === data.priceInCents) {
        searchedStripeProductParams.default_price =
          searchedStripePrice.data[0].id;
      } else {
        const createdStripePrice = await createStripePrice({
          currency: "pln",
          product: product.id,
          unit_amount: data.priceInCents,
        });
        createdStripePrice &&
          (searchedStripeProductParams.default_price = createdStripePrice.id);
      }
    }

    updatedProduct = await updateStripeProduct(
      product.id,
      searchedStripeProductParams
    );
  }

  if (!updatedProduct) return; // If Stripe product update failed, return

  // Update product in the database
  await updateProductInDB(data, product).then(() => {
    redirect("/admin/products");
  });
}

export async function deleteProduct(id: string) {
  await deleteStripeProduct(id);

  await deleteProductInDB(id);
}

// Helper functions to check if images are equal
function areImagesEqual(
  images1: { url: string }[],
  images2: { url: string }[]
): boolean {
  if (images1.length !== images2.length) {
    return false;
  }
  const urls1 = images1.map((image) => image.url);
  const urls2 = images2.map((image) => image.url);
  urls1.sort();
  urls2.sort();
  for (let i = 0; i < urls1.length; i++) {
    if (urls1[i] !== urls2[i]) {
      return false;
    }
  }
  return true;
}

function processFormData(formData: FormData): FormDataEntries {
  const data: FormDataEntries = Object.fromEntries(formData.entries());

  if (typeof data.categories === "string" && data.categories !== "") {
    data.categories = data.categories.split(",");
  }

  if (typeof data.images === "string") {
    const parsedData = JSON.parse(data.images);
    parsedData[0].isMainForProduct = true;
    data.images = parsedData;
  }

  if (typeof data.productFile === "string") {
    data.productFile = JSON.parse(data.productFile);
  }

  if (
    data.productFile &&
    typeof data.productFile === "object" &&
    "name" in data.productFile &&
    data.fileName &&
    data.fileName !== data.productFile.name
  ) {
    data.productFile = {
      ...data.productFile,
      name: data.fileName,
    } as FormDataEntries["productFile"];
  }

  return data;
}

function validateAndParseData(data: FormDataEntries) {
  const result = productAddSchema.safeParse(data);

  if (result.success === false) {
    return { error: result.error.formErrors.fieldErrors };
  }

  return { data: { ...result.data } };
}
