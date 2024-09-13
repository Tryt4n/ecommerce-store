import React from "react";
import ListGrid from "@/layout/ListGrid";
import AdminDashboardCardListItem from "./AdminDashboardCardListItem";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import type { getDashboardData } from "@/db/adminData/dashboardData";

type AdminDashboardCardList = {
  data: Pick<
    NonNullable<Awaited<ReturnType<typeof getDashboardData>>>,
    "salesData" | "usersData" | "productsData"
  >;
};

export default async function AdminDashboardCardList({
  data,
}: AdminDashboardCardList) {
  return (
    <ListGrid>
      <AdminDashboardCardListItem
        title="Sales"
        subtitle={`${formatNumber(data.salesData.numberOfSales || 0)} Orders`}
        body={formatCurrency(data.salesData.amount || 0)}
      />

      <AdminDashboardCardListItem
        title="Customers"
        subtitle={`${formatCurrency(data.usersData.averageValuePerUser || 0)} Average Value`}
        body={formatNumber(data.usersData.usersCount || 0)}
      />

      <AdminDashboardCardListItem
        title="Active Products"
        subtitle={`${formatNumber(data.productsData.inactiveProductsCount || 0)} Inactive`}
        body={formatNumber(data.productsData.activeProductsCount || 0)}
      />
    </ListGrid>
  );
}
