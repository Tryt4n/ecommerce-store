"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export default function SearchInput() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex-grow">
      <Label htmlFor="search" className="sr-only">
        Search
      </Label>

      <Input
        type="search"
        id="search"
        name="search"
        placeholder="Search"
        value={searchParams.get("searchQuery") || ""}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams);
          params.set("searchQuery", e.target.value);

          router.push(`${pathname}?${params.toString()}`, { scroll: false });
        }}
      />
    </div>
  );
}
