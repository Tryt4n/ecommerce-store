import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders History",
  description: "View all products you have ordered in the past.",
};

export default function OrdersPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
