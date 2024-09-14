"use client";

import React, { type ComponentProps } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { RANGE_OPTIONS } from "@/lib/rangeOptions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ChartDataDropdownMenuProps = {
  queryKey: string;
  className?: ComponentProps<typeof DropdownMenuTrigger>["className"];
};

export default function ChartDataDropdownMenu({
  queryKey,
  className,
}: ChartDataDropdownMenuProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  function setRange(range: keyof typeof RANGE_OPTIONS) {
    const params = new URLSearchParams(searchParams);

    params.set(queryKey, range);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const currentRange = searchParams.get(queryKey) as
    | keyof typeof RANGE_OPTIONS
    | null;

  const currentLabel = currentRange
    ? RANGE_OPTIONS[currentRange]?.label
    : RANGE_OPTIONS["last_7_days"].label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className}>
        <Button variant="outline">{currentLabel}</Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {Object.entries(RANGE_OPTIONS).map(([key, option]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => setRange(key as keyof typeof RANGE_OPTIONS)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
