"use client";

import React, { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function SearchInput() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [value, setValue] = useState(searchParams.get("searchQuery") || "");

  return (
    <form
      className="flex flex-grow gap-2"
      onSubmit={(e) => {
        e.preventDefault();

        const params = new URLSearchParams(searchParams);
        params.set("searchQuery", value);

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      }}
    >
      <Label htmlFor="search" className="sr-only">
        Search
      </Label>

      <Input
        type="search"
        id="search"
        name="search"
        placeholder="Search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <Button type="submit" variant="outline">
        Search
      </Button>
    </form>
  );
}
