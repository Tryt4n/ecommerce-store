import React from "react";
import { Nav, NavLink } from "../../layout/Nav";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/products">Products</NavLink>
        <NavLink href="/orders">My Orders</NavLink>
      </Nav>
      <main className="container mx-auto my-6 space-y-12 px-6">{children}</main>
    </>
  );
}
