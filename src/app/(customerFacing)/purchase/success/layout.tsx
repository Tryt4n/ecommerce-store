import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Purchase successful",
};

export default function PurchaseSuccessLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
