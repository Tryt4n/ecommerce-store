import React from "react";
import DateRangeDropdownMenu from "./DateRangeDropdownMenu";
import SearchInput from "@/components/SearchInput";
import { Button } from "@/components/ui/button";

export default function AdminPageHeader({
  children,
  withDateRange = true,
  withLink,
}: {
  children: React.ReactNode;
  withDateRange?: boolean;
  withLink?: { href: string; label: string };
}) {
  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-4xl">{children}</h1>

        {withLink && <Button href={withLink.href}>{withLink.label}</Button>}
      </div>

      <div className="my-4 flex flex-row gap-4">
        {withDateRange && <DateRangeDropdownMenu queryKey="dateRange" />}

        <SearchInput />
      </div>
    </>
  );
}
