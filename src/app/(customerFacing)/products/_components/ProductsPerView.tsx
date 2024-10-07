"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useProductsContext } from "../_hooks/useProductsContext";
import { getLastPageNumber } from "../_helpers/pageNumber";
import { Button } from "@/components/ui/button";
import {
  defaultProductsPerPage,
  productsPerPageValues,
  type ProductsPerPage,
} from "../_types/layoutTypes";
import type { ProductsSearchParams } from "../page";

export default function ProductsPerView({
  searchParams,
}: {
  searchParams: ProductsSearchParams;
}) {
  const { productsCount } = useProductsContext();
  const router = useRouter();
  const pathname = usePathname();
  const { take, page } = searchParams;

  const productsPerPage = take ? Number(take) : defaultProductsPerPage;

  // If the number of products is less than or equal to the number of products per page, do not display the page navigation
  if (productsCount && productsCount <= productsPerPage) return null;

  function changeProductsPerPage(value: ProductsPerPage) {
    // Calculate the last page number based on the new products per page value
    const lastPageNumber = getLastPageNumber(productsCount, value);

    // If the current page number is greater than the last page number, set the page number to the last page number. Otherwise, keep the current page number.
    const pageParam =
      (lastPageNumber && page && Number(page) > lastPageNumber
        ? lastPageNumber.toString()
        : page) || "1";

    const params = new URLSearchParams({
      ...searchParams,
      take: value.toString(),
      page: pageParam,
    });

    // Update the URL with the new sorting params
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
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
