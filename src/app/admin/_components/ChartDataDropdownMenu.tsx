"use client";

import React, { useState, type ComponentProps } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getRangeOption, RANGE_OPTIONS } from "@/lib/rangeOptions";
import { subDays } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import type { DateRange } from "react-day-picker";

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

  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  function setRange(range: keyof typeof RANGE_OPTIONS | DateRange) {
    const params = new URLSearchParams(searchParams);

    if (typeof range === "string") {
      params.set(queryKey, range);
      params.delete(`${queryKey}From`);
      params.delete(`${queryKey}To`);
    } else {
      if (!range.from || !range.to) return;

      params.delete(queryKey);
      params.set(`${queryKey}From`, range.from.toISOString());
      params.set(`${queryKey}To`, range.to.toISOString());
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const currentRange = searchParams.get(queryKey) as string;
  const currentRangeFrom = searchParams.get(`${queryKey}From`) as string;
  const currentRangeTo = searchParams.get(`${queryKey}To`) as string;

  const rangeOptions = getRangeOption(
    currentRange,
    currentRangeFrom,
    currentRangeTo
  );

  const label = rangeOptions?.label || RANGE_OPTIONS.last_7_days.label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className}>
        <Button variant="outline">{label}</Button>
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

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Custom</DropdownMenuSubTrigger>

          <DropdownMenuSubContent>
            <div>
              <Calendar
                mode="range"
                disabled={{ after: new Date() }}
                selected={dateRange}
                defaultMonth={subDays(new Date(), 29)}
                onSelect={setDateRange}
                min={3}
                numberOfMonths={2}
              />

              <DropdownMenuItem className="hover:bg-auto" disabled={!dateRange}>
                <Button
                  className="w-full"
                  disabled={!dateRange}
                  onClick={() => {
                    if (!dateRange) return;
                    setRange(dateRange);
                  }}
                >
                  Submit
                </Button>
              </DropdownMenuItem>
            </div>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
