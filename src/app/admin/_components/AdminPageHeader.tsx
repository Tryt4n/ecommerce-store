import React from "react";
import DateRangeDropdownMenu from "./DateRangeDropdownMenu";

export default function AdminPageHeader({
  children,
  withDateRange = true,
}: {
  children: React.ReactNode;
  withDateRange?: boolean;
}) {
  return (
    <div className="mb-4 flex gap-4">
      <h1 className="text-4xl">{children}</h1>

      {withDateRange && <DateRangeDropdownMenu queryKey="dateRange" />}
    </div>
  );
}
