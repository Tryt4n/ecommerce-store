import React from "react";
import AdminContextProvider from "./_context/AdminContext";
import type { Metadata } from "next/types";

export const dynamic = "force-dynamic"; // Force NextJS to not cache any of admin pages

export const metadata: Metadata = {
  title: "Admin",
  description: "Admin page",
  openGraph: null,
  robots: null,
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminContextProvider>
      <main className="container mx-auto my-6 px-6">{children}</main>
    </AdminContextProvider>
  );
}
