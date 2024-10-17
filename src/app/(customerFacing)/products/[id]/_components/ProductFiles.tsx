import React from "react";
import Link from "next/link";
import type { getProduct } from "@/db/userData/products";

type ProductFilesProps = {
  product: NonNullable<Awaited<ReturnType<typeof getProduct>>>;
};

export default async function ProductFiles({ product }: ProductFilesProps) {
  return (
    <section className="mt-6">
      <h2 className="mb-1 text-balance text-lg font-semibold">
        Files to download
      </h2>

      <ul className="flex flex-row flex-wrap gap-x-4 gap-y-1 indent-4 text-base">
        <li>
          <Link
            href={`/products/${product.id}/download/productDetails`}
            download
            title="Download product details"
            className="underline underline-offset-2 transition-colors hover:text-muted-foreground"
          >
            Product Details
          </Link>
        </li>

        {product.productFile && (
          <li className="capitalize">
            <Link
              href={`/products/${product.id}/download/productFile`}
              download
              title="Download product file"
              className="underline underline-offset-2 transition-colors hover:text-muted-foreground"
            >
              {product.productFile?.name}
            </Link>
          </li>
        )}
      </ul>
    </section>
  );
}
