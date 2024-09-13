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
  return (
    <ResponsiveContainer width="100%" minHeight={300}>
      <PieChart>
        <Tooltip
          cursor={{ fill: "hsl(var(--muted))" }}
          formatter={(value) => formatCurrency(value as number)}
        />

        <Pie
          data={data}
          dataKey="revenue"
          nameKey="name"
          label={(item) => item.name}
          fill="hsl(var(--primary))"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
