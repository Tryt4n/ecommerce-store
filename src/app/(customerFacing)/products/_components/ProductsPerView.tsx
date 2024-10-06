"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { createNewSearchParams } from "../_helpers/searchParams";
import { Button } from "@/components/ui/button";
import {
  defaultProductsPerPage,
  productsPerPageValues,
  type ProductsPerPage,
} from "../_types/layoutTypes";
import type { ProductsSearchParams } from "../page";

export default function ProductsPerView({
  searchParams,
  lastPageNumber,
}: {
  searchParams: ProductsSearchParams;
  lastPageNumber?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { take } = searchParams;

  const isValidProductsPerPage = (value: number): value is ProductsPerPage => {
    return productsPerPageValues.includes(value as ProductsPerPage);
  };

  // Default to 12 products per page if the query parameter is not provided or invalid
  const productsPerPage = (
    isValidProductsPerPage(Number(take)) ? Number(take) : defaultProductsPerPage
  ) as ProductsPerPage;

  function changeProductsPerPage(value: ProductsPerPage) {
    const params = createNewSearchParams(
      searchParams,
      "take",
      value.toString()
    );

    // Update the URL with the new sorting params
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  if (
    searchParams &&
    lastPageNumber &&
    Number(searchParams.page) > lastPageNumber
  ) {
    const params = createNewSearchParams(
      searchParams,
      "page",
      lastPageNumber.toString()
    );

    router.push(`${pathname}?${params}`, { scroll: false });
  }

  return (
    <div>
      <p
        id="productsPerPage"
        className="text-sm font-medium sm:text-end"
        aria-label="Select number of products per page"
      >
        Products per page
      </p>

      <div
        className="mt-1 flex flex-row gap-1 sm:justify-end"
        aria-describedby="productsPerPage"
      >
        {productsPerPageValues.map((value) => (
          <Button
            key={value}
            type="button"
            variant="outline"
            disabled={productsPerPage === value}
            aria-label={
              productsPerPage === value
                ? "Current number of products displayed on the page."
                : `Click to display ${value} products per page.`
            }
            onClick={() => changeProductsPerPage(value)}
          >
            {value}
          </Button>
        ))}
      </div>
    </div>
  );
}
