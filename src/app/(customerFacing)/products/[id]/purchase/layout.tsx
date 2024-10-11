import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Purchase",
  description:
    "This is not a real payment. It works like a real payment, but it will not charge any card. Disclaimer: This is not a real payment system. No actual bank accounts or credit cards will be charged. The data provided is purely for demonstration purposes. Please note: This website is a personal project and not a real online store. Any transactions you make here are for testing and demonstration purposes only.",
  keywords: ["stripe", "stripe payments"],
};

export default function PurchasePageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
