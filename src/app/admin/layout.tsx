import React from "react";
import AdminContextProvider from "./_context/AdminContext";
import { Nav, NavLink } from "../../layout/Nav";

export const dynamic = "force-dynamic"; // Force NextJS to not cache any of admin pages

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminContextProvider>
      <Nav>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/admin">Dashboard</NavLink>
        <NavLink href="/admin/products">Products</NavLink>
        <NavLink href="/admin/users">Customers</NavLink>
        <NavLink href="/admin/orders">Sales</NavLink>
        <NavLink href="/admin/discount-codes">Coupons</NavLink>
      </Nav>
      <main className="container mx-auto my-6 px-6 sm:px-0">{children}</main>
    </AdminContextProvider>
  );
}
