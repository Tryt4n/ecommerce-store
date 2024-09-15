"use client";

import React, { type ComponentProps } from "react";
import useProductsContext from "../products/_hooks/useProductsContext";
import { TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import type { getAllProducts } from "@/db/adminData/products";
import type { SortingType } from "@/types/sort";

type ProductsArray = NonNullable<Awaited<ReturnType<typeof getAllProducts>>>;

type TableHeadSortingButtonProps = {
  title: string;
  sortingField: keyof ProductsArray[number];
  sortingType?: SortingType;
} & ComponentProps<typeof TableHead>;

export default function TableHeadSortingButton({
  title,
  sortingField,
  sortingType = "asc",
  ...props
}: TableHeadSortingButtonProps) {
  const { sortProducts } = useProductsContext();

  return (
    <TableHead {...props}>
      <Button
        variant="ghost"
        onClick={() => sortProducts(sortingField, sortingType)}
      >
        {title}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    </TableHead>
  );
}
