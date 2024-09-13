import React from "react";
import AdminDashboardCardList from "./_components/AdminDashboardCardList";
import AdminDashboardCharts from "./_components/AdminDashboardCharts";
import { getDashboardData } from "@/db/adminData";
import { subDays } from "date-fns";

export default async function AdminDashboard() {
  const data = await getDashboardData(subDays(new Date(), 6), new Date());

  return (
    <>
      <h1 className="sr-only">Admin Dashboard</h1>

      <section>
        <h2 className="sr-only">Summary</h2>

        {data && (
          <AdminDashboardCardList
            data={{
              productsData: data.productsData,
              salesData: data.salesData,
              usersData: data.usersData,
            }}
          />
        )}
      </section>

      <section className="mt-8">
        <h2 className="sr-only">Charts</h2>

        {data && <AdminDashboardCharts data={data.chartsData} />}
      </section>
    </>
  );
}
