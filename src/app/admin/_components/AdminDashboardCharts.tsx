import React from "react";
import AdminDashboardCard from "./AdminDashboardCard";
import OrdersByDayChart from "./charts/OrdersByDayChart";
import UsersByDayChart from "./charts/UsersByDayChart";
import RevenueByProductChart from "./charts/RevenueByProductChart";
import type { getDashboardData } from "@/db/adminData/dashboardData";

type AdminDashboardChartsProps = {
  data: NonNullable<Awaited<ReturnType<typeof getDashboardData>>>["chartsData"];
};

export default function AdminDashboardCharts({
  data,
}: AdminDashboardChartsProps) {
  return (
    <div className="grid-cols1 grid gap-4 lg:grid-cols-2">
      <AdminDashboardCard title="Total Sales">
        <OrdersByDayChart data={data.ordersCreationData} />
      </AdminDashboardCard>

      <AdminDashboardCard title="New Customers">
        <UsersByDayChart data={data.usersCreationDates} />
      </AdminDashboardCard>

      <AdminDashboardCard title="Revenue By Product">
        <RevenueByProductChart data={data.revenueByProduct} />
      </AdminDashboardCard>
    </div>
  );
}
