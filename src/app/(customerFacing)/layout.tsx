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
      <main className="container mx-auto space-y-12 px-6">
        <h1 className="sr-only">Home page</h1>
        {children}
      </main>
    </>
  );
}