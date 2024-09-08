import React from "react";
import { Nav, NavLink } from "../../components/Nav";

export const dynamic = "force-dynamic"; // Force NextJS to not cache any of admin pages

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav>
        <NavLink href="/admin">Dashboard</NavLink>
        <NavLink href="/admin/products">Products</NavLink>
        <NavLink href="/admin/users">Customers</NavLink>
        <NavLink href="/admin/orders">Sales</NavLink>
      </Nav>
      <main className="container mx-auto my-6">{children}</main>
    </>
  );
}