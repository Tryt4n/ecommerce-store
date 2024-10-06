"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { createNewSearchParams } from "../_helpers/searchParams";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
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

  function handleFilter(key: "sortBy" | "order", param: string) {
    const params = createNewSearchParams(searchParams, key, param);

    router.push(`${pathname}?${params.toString()}`, { scroll: true });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline">
          <FilterIcon />
        </Button>
      </PopoverTrigger>

      <PopoverContent side="bottom">
        <div className="flex h-full flex-row gap-4">
          <Select
            defaultValue={sortBy || "name"}
            onValueChange={(value) => handleFilter("sortBy", value)}
          >
            <SelectTrigger>Sort by</SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  value="name"
                  className="cursor-pointer"
                  defaultChecked
                >
                  Name
                </SelectItem>
                <SelectItem value="priceInCents" className="cursor-pointer">
                  Price
                </SelectItem>
                <SelectItem value="createdAt" className="cursor-pointer">
                  Date
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Separator orientation="vertical" className="h-[40px]" />

          <Select
            defaultValue={order || "asc"}
            onValueChange={(value) => handleFilter("order", value)}
          >
            <SelectTrigger>Order by</SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>
                  {sortBy === "createdAt"
                    ? "Date"
                    : sortBy === "priceInCents"
                      ? "Price"
                      : "Alphabetically"}
                </SelectLabel>

                <SelectItem value="asc" className="cursor-pointer">
                  {sortBy === "createdAt" ? "Newest" : "Ascending"}
                </SelectItem>
                <SelectItem value="desc" className="cursor-pointer">
                  {sortBy === "createdAt" ? "Oldest" : "Descending"}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
}
