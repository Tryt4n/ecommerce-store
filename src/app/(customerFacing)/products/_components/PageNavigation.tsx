"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useProductsContext } from "../_hooks/useProductsContext";
import { createNewSearchParams } from "../_helpers/searchParams";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { defaultProductsPerPage } from "../_types/layoutTypes";

export default function PageNavigation({
  productsCount,
}: {
  productsCount?: number;
}) {
  const { searchParams } = useProductsContext();
  const router = useRouter();
  const pathname = usePathname();

  const currentPageNumber = Number(searchParams.page) || 1;
  const lastPageNumber =
    productsCount &&
    Math.ceil(
      productsCount / (Number(searchParams.take) || defaultProductsPerPage)
    );

  function handleChangePage(page: number) {
    const params = createNewSearchParams(searchParams, "page", page.toString());

    router.push(`${pathname}?${params.toString()}`, { scroll: true });
  }

  const btnSize = "h-[40px] w-[40px]";
  const commonButtonProps = {
    type: "button",
    variant: "outline" as any,
    className: btnSize,
  };

  return (
    <nav className="text-sm" aria-describedby="navHeader">
      <span id="navHeader" className="font-medium" aria-label="Select Page">
        Page
      </span>

      <div className="mt-1 flex flex-row gap-1">
        {currentPageNumber !== 1 && (
          // Display the previous page button only if there is a previous page
          <Button
            {...commonButtonProps}
            className={commonButtonProps.className + " text-2xl"}
            onClick={() => handleChangePage(currentPageNumber - 1)}
          >
            &lsaquo;
            <span className="sr-only">Go to previous page.</span>
          </Button>
        )}

        {currentPageNumber >= 3 && (
          // Display the first page button only if there are at least two pages before the current page because the navigation for the first page in this case is displayed separately as the previous page button
          <Button {...commonButtonProps} onClick={() => handleChangePage(1)}>
            1<span className="sr-only">Go to first page.</span>
          </Button>
        )}

        <Button
          type="button"
          variant="outline"
          className={btnSize}
          aria-label="Current page"
          disabled
        >
          {currentPageNumber}
        </Button>

        {lastPageNumber && currentPageNumber <= lastPageNumber - 2 && (
          // Display the last page button only if there are at least two pages left because the navigation for the last page in this case is displayed separately as the next page button
          <Button
            {...commonButtonProps}
            onClick={() => handleChangePage(lastPageNumber)}
          >
            {lastPageNumber}
            <span className="sr-only">Go to next page.</span>
          </Button>
        )}

        {currentPageNumber !== lastPageNumber && (
          // Display the next page button only if there is a next page
          <Button
            {...commonButtonProps}
            className={commonButtonProps.className + " text-2xl"}
            onClick={() => handleChangePage(currentPageNumber + 1)}
          >
            &rsaquo;
            <span className="sr-only">Go to next page.</span>
          </Button>
        )}

        {lastPageNumber && lastPageNumber > 3 && (
          // Display the custom page input only if there are more than three pages
          <div>
            <Label htmlFor="customPage" className="sr-only">
              Select page by entered number
            </Label>
            <Input
              id="customPage"
              name="customPage"
              type="number"
              className="h-[40px] w-[60px] text-center text-sm font-medium"
              style={{ lineHeight: 0 }}
              placeholder="..."
              min={currentPageNumber === 1 ? 2 : 1}
              max={
                lastPageNumber === currentPageNumber
                  ? lastPageNumber - 1
                  : lastPageNumber
              }
              maxLength={String(lastPageNumber).length}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const customPage = Number(e.currentTarget.value);

                  if (customPage === currentPageNumber) return;

                  handleChangePage(customPage);
                  e.currentTarget.blur();
                  e.currentTarget.value = "";
                }
              }}
              onBlur={(e) => {
                e.currentTarget.value = "";
              }}
            />
          </div>
        )}
      </div>
    </nav>
  );
}
