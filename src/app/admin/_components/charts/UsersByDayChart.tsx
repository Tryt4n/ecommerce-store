"use client";

import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatNumber } from "@/lib/formatters";
import type { ChartDataArrayType } from "@/lib/dashboardDataHelpers";

export default function UsersByDayChart({
  data,
}: {
  data: ChartDataArrayType;
}) {
  return (
    <ResponsiveContainer width="100%" minHeight={300}>
      <BarChart data={data}>
        <CartesianGrid stroke="hsl(var(--muted))" />

        <XAxis dataKey="date" name="Date" stroke="hsl(var(--primary))" />
        <YAxis
          stroke="hsl(var(--primary))"
          allowDecimals={false}
          tickFormatter={(tick) => formatNumber(tick)}
        />

        <Tooltip
          cursor={{ fill: "hsl(var(--muted))" }}
          formatter={(value) => formatNumber(value as number)}
        />

        <Bar
          dataKey="totalUsers"
          name="New Customers"
          stroke="hsl(var(--primary))"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
