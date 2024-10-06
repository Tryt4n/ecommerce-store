"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  defaultProductsLayout,
  productsPerPageValues,
  type ProductsPerPage,
} from "../_types/layoutTypes";
import { usePathname, useRouter } from "next/navigation";
import type { ProductsSearchParams } from "../page";

export default function ProductsPerView({
  searchParams,
}: {
  searchParams: ProductsSearchParams;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { take } = searchParams;

  const isValidProductsPerPage = (value: number): value is ProductsPerPage => {
    return productsPerPageValues.includes(value as ProductsPerPage);
  };

  // Default to 12 products per page if the query parameter is not provided or invalid
  const productsPerPage = (
    isValidProductsPerPage(Number(take)) ? Number(take) : defaultProductsLayout
  ) as ProductsPerPage;

  function changeProductPerPage(value: ProductsPerPage) {
    const params = new URLSearchParams({
      ...searchParams,
      take: value.toString(),
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
            onClick={() => changeProductPerPage(value)}
          >
            {value}
          </Button>
        ))}
      </div>
    </div>
  );
}
