import React from "react";
import CustomLayoutProductCard from "./CustomLayoutProductCard";
import { defaultProductsPerPage } from "../_types/layoutTypes";
import type { getAllAvailableForPurchaseProducts } from "@/db/userData/products";
import type { ProductsSearchParams } from "../page";

type ProductSuspenseProps = {
  productsFetcher: typeof getAllAvailableForPurchaseProducts;
  searchParams: ProductsSearchParams;
};

export default async function CustomProductsSuspense({
  productsFetcher,
  searchParams: {
    page = "1",
    take = defaultProductsPerPage.toString(),
    sortBy = "name",
    order = "asc",
    searchQuery,
  },
}: ProductSuspenseProps) {
  const productsToSkip =
    (page &&
      take &&
      page !== "" &&
      take !== "" &&
      (Number(page) - 1) * Number(take)) ||
    0; // Number of products to skip. `page` has to be subtracted by 1 to avoid skipping the first page
  const productsToDisplay =
    (take && take !== "" && Number(take)) || defaultProductsPerPage;
  const productsSortBy =
    (sortBy &&
      (sortBy === "name" ||
        sortBy === "priceInCents" ||
        sortBy === "createdAt") &&
      sortBy) ||
    "name";
  const productsOrder =
    (order && (order === "asc" || order === "desc") && order) || "asc";

  const products = await productsFetcher(
    productsSortBy,
    productsOrder,
    productsToSkip,
    productsToDisplay,
    searchQuery
  );

  return (
    <>
      {products && products.length > 1 ? (
        <>
          {products.map((product) => (
            <CustomLayoutProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              priceInCents={product.priceInCents}
              description={product.description}
              imageUrl={product.images[0]?.url}
              categories={product.categories}
            />
          ))}
        </>
      ) : (
        <p className="col-span-full text-center">
          Searched products not found.
        </p>
      )}
    </>
  );
}
