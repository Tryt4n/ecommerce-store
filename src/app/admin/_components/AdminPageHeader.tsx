import React from "react";
import DateRangeDropdownMenu from "./DateRangeDropdownMenu";

export default function AdminPageHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex gap-4">
      <h1 className="text-4xl">{children}</h1>

      <DateRangeDropdownMenu queryKey="dateRange" />
    </div>
  );
}
