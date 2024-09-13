"use client";

import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/formatters";
import type { ChartDataArrayType } from "@/lib/dashboardDataHelpers";

export default function OrdersByDayChart({
  data,
}: {
  data: ChartDataArrayType;
}) {
  return (
    <ResponsiveContainer width="100%" minHeight={300}>
      <LineChart data={data}>
        <CartesianGrid stroke="hsl(var(--muted))" />

        <XAxis dataKey="date" name="Date" stroke="hsl(var(--primary))" />
        <YAxis
          stroke="hsl(var(--primary))"
          tickFormatter={(tick) => formatCurrency(tick)}
        />

        <Tooltip formatter={(value) => formatCurrency(value as number)} />

        <Line
          dataKey="totalSales"
          name="Total Sales"
          type="monotone"
          stroke="hsl(var(--primary))"
          //   dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
