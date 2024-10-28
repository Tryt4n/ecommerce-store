"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";

type SearchInputProps = {
  className?: string;
};

export default function SearchInput({ className }: SearchInputProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const searchQuery = searchParams.get("searchQuery");
  const [value, setValue] = useState(searchQuery || "");

  // Reset value for the input when searchQuery would be deleted
  useEffect(() => {
    if (!searchQuery) {
      setValue("");
    }
  }, [searchQuery]);

  return (
    <form
      className={`flex flex-grow gap-2${className ? ` ${className}` : ""}`}
      onSubmit={(e) => {
        e.preventDefault();

        const params = new URLSearchParams(searchParams);
        params.set("searchQuery", value);

        // Reset the page number to 1 when the search query changes
        const page = searchParams.get("page");
        if (page) {
          params.set("page", "1");
        }

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      }}
    >
      <Label htmlFor="search" className="sr-only">
        Search for products
      </Label>

      <div className="relative w-full">
        <Input
          type="search"
          id="search"
          name="search"
          placeholder="Search"
          autoComplete="off"
          maxLength={256}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        {searchQuery && searchQuery !== "" && (
          <Button
            type="reset"
            variant="destructive"
            className="absolute right-0 top-0 aspect-square p-2"
            aria-label="Click to clear searching"
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.delete("searchQuery");

              router.push(`${pathname}?${params.toString()}`, {
                scroll: false,
              });
            }}
          >
            <Trash size={16} />
            <span className="sr-only">Clear searching</span>
          </Button>
        )}
      </div>

      <Button type="submit" variant="outline">
        Search
      </Button>
    </form>
  );
}
