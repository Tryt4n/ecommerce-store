"use client";

import React from "react";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/formatters";
import type { calculateRevenueByProduct } from "@/lib/dashboardDataHelpers";

export default function RevenueByProductChart({
  data,
}: {
  data: ReturnType<typeof calculateRevenueByProduct>;
}) {
  const reducedData = data.filter((item) => item.revenue > 0);

  return (
    <>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" minHeight={300}>
          <PieChart>
            <Tooltip
              cursor={{ fill: "hsl(var(--muted))" }}
              formatter={(value) => formatCurrency(value as number)}
            />

            <Pie
              data={reducedData}
              dataKey="revenue"
              nameKey="name"
              label={(item) => item.name}
              fill="hsl(var(--primary))"
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center">No data found</p>
      )}
    </>
  );
}
