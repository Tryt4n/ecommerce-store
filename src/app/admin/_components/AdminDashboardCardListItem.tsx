import React, { type ComponentProps } from "react";
import DashboardCard from "./DashboardCard";

type AdminDashboardCardListItemProps = ComponentProps<typeof DashboardCard>;

export default function AdminDashboardCardListItem({
  ...props
}: AdminDashboardCardListItemProps) {
  return (
    <li>
      <DashboardCard {...props} />
    </li>
  );
}
