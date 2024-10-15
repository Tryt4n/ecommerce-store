import { getAllAvailableProductsIds } from "@/db/userData/products";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllAvailableProductsIds();

  const productEntries: MetadataRoute.Sitemap =
    products?.flatMap((product) => [
      {
        url: `${process.env.NEXT_PUBLIC_SERVER_URL}/products/${product.id}`,
        lastModified: product.updatedAt,
      },
    ]) ?? [];

  return [
    {
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/products`,
    },
    ...productEntries,
  ];
}
