import React from "react";
import DashboardCard from "./DashboardCard";
import OrdersByDayChart from "./charts/OrdersByDayChart";
import UsersByDayChart from "./charts/UsersByDayChart";
import RevenueByProductChart from "./charts/RevenueByProductChart";
import type { getDashboardData } from "@/db/adminData";

type AdminDashboardChartsProps = {
  data: NonNullable<Awaited<ReturnType<typeof getDashboardData>>>["chartsData"];
};

export default function AdminDashboardCharts({
  data,
}: AdminDashboardChartsProps) {
  return (
    <div className="grid-cols1 grid gap-4 lg:grid-cols-2">
      <DashboardCard title="Total Sales">
        <OrdersByDayChart data={data.ordersCreationData} />
      </DashboardCard>

      <DashboardCard title="New Customers">
        <UsersByDayChart data={data.usersCreationDates} />
      </DashboardCard>

      <DashboardCard title="Revenue By Product">
        <RevenueByProductChart data={data.revenueByProduct} />
      </DashboardCard>
    </div>
  );
}
