import React, { type ComponentProps } from "react";
import AdminDashboardCard from "./AdminDashboardCard";

type AdminDashboardCardListItemProps = ComponentProps<
  typeof AdminDashboardCard
>;

export default function AdminDashboardCardListItem({
  ...props
}: AdminDashboardCardListItemProps) {
  return (
    <li>
      <AdminDashboardCard {...props} />
    </li>
  );
}
