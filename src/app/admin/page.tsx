import React from "react";
import AdminDashboardCardList from "./_components/AdminDashboardCardList";
import AdminDashboardCharts from "./_components/AdminDashboardCharts";
import { getDashboardData } from "@/db/adminData/dashboardData";
import { getRangeOption, RANGE_OPTIONS } from "@/lib/rangeOptions";

type SearchParams = {
  searchParams: {
    totalSalesRange?: string;
    newCustomersRange?: string;
    revenueByProductRange?: string;
  };
};

export default async function AdminDashboard({ searchParams }: SearchParams) {
  const { totalSalesRange, newCustomersRange, revenueByProductRange } =
    searchParams;

  const salesDataRange =
    getRangeOption(totalSalesRange) || RANGE_OPTIONS.last_7_days;
  const usersDataRange =
    getRangeOption(newCustomersRange) || RANGE_OPTIONS.last_7_days;
  const productsDataRange =
    getRangeOption(revenueByProductRange) || RANGE_OPTIONS.last_7_days;

  const data = await getDashboardData({
    salesDataRangeData: {
      createdAfter: salesDataRange.startDate,
      createdBefore: salesDataRange.endDate,
    },
    customersDataRangeData: {
      createdAfter: usersDataRange.startDate,
      createdBefore: usersDataRange.endDate,
    },
    revenueByProductData: {
      createdAfter: productsDataRange.startDate,
      createdBefore: productsDataRange.endDate,
    },
  });

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
