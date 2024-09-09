import React from "react";
import ListGrid from "@/layout/ListGrid";
import DashboardCard from "../../../components/DashboardCard";
import { getSalesData, getUsersData, getProductsData } from "@/db/adminData";
import { formatCurrency, formatNumber } from "@/lib/formatters";

export default async function AdminDashboardCardList() {
  const [salesData, usersData, productsData] = await Promise.all([
    getSalesData(),
    getUsersData(),
    getProductsData(),
  ]);

  return (
    <ListGrid>
      <DashboardCard
        title="Sales"
        subtitle={`${formatNumber(salesData?.numberOfSales || 0)} Orders`}
        body={formatCurrency(salesData?.amount || 0)}
      />

      <DashboardCard
        title="Customers"
        subtitle={`${formatCurrency(usersData?.averageValuePerUser || 0)} Average Value`}
        body={formatNumber(usersData?.userCount || 0)}
      />

      <DashboardCard
        title="Active Products"
        subtitle={`${formatNumber(productsData?.inactiveProducts || 0)} Inactive`}
        body={formatNumber(productsData?.activeProducts || 0)}
      />
    </ListGrid>
  );
}
