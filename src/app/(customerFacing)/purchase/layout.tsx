import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart",
};

export default function ShoppingCartLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
