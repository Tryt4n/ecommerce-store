"use client";

import React, { type ComponentProps } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilterIcon } from "lucide-react";
import type { ProductsSearchParams } from "../page";

export default function FiltersButton({
  searchParams,
}: {
  searchParams: ProductsSearchParams;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { sortBy, order } = searchParams;

  function handleFilter(
    sortByValue: NonNullable<typeof sortBy>,
    orderValue: NonNullable<typeof order>
  ) {
    const params = new URLSearchParams({
      ...searchParams,
      sortBy: sortByValue,
      order: orderValue,
    });

    router.push(`${pathname}?${params.toString()}`, { scroll: true });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline">
          <FilterIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="bottom">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <CustomDropdownMenuCheckboxItem
          label="Alphabetically ascending"
          checked={
            (sortBy === "name" && !order) ||
            (!sortBy && (!order || order === "asc")) ||
            (sortBy === "name" && order === "asc")
          }
          onClick={() => handleFilter("name", "asc")}
        />
        <CustomDropdownMenuCheckboxItem
          label="Alphabetically descending"
          checked={
            (!sortBy && order === "desc") ||
            (sortBy === "name" && order === "desc")
          }
          onClick={() => handleFilter("name", "desc")}
        />

        <CustomDropdownMenuCheckboxItem
          label="Price ascending"
          checked={
            (sortBy === "priceInCents" && order === "asc") ||
            (sortBy === "priceInCents" && !order)
          }
          onClick={() => handleFilter("priceInCents", "asc")}
        />
        <CustomDropdownMenuCheckboxItem
          label="Price descending"
          checked={sortBy === "priceInCents" && order === "desc"}
          onClick={() => handleFilter("priceInCents", "desc")}
        />

        <CustomDropdownMenuCheckboxItem
          label="Newest"
          checked={sortBy === "createdAt" && order === "desc"}
          onClick={() => handleFilter("createdAt", "desc")}
        />
        <CustomDropdownMenuCheckboxItem
          label="Oldest"
          checked={
            (sortBy === "createdAt" && order === "asc") ||
            (sortBy === "createdAt" && !order)
          }
          onClick={() => handleFilter("createdAt", "asc")}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CustomDropdownMenuCheckboxItem({
  label,
  ...props
}: { label: string } & ComponentProps<typeof DropdownMenuCheckboxItem>) {
  return (
    <DropdownMenuCheckboxItem
      {...props}
      disabled={props.checked ? true : props.disabled}
      className={`cursor-pointer${props.className ? ` ${props.className}` : ""}`}
    >
      {label}
    </DropdownMenuCheckboxItem>
  );
}
