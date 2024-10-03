"use client";

import React, { type ComponentProps } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Link from "next/link";

const linkClassNames =
  "p-4 hover:bg-secondary hover:text-secondary-foreground focus:bg-secondary focus:text-secondary-foreground";

export default function Navbar() {
  const { isAuthenticated, permissions } = useKindeBrowserClient();

  return (
    <nav className="flex justify-center bg-primary p-4 px-4 text-primary-foreground">
      <ul
        className="flex flex-grow flex-wrap justify-center gap-x-0.5 gap-y-8"
        aria-label="Page navigation"
      >
        <NavLink href="/">Home</NavLink>
        <NavLink href="/products">Products</NavLink>

        {isAuthenticated && !permissions.permissions.includes("admin") && (
          <NavLink href="/orders">My Orders</NavLink>
        )}

        {isAuthenticated && permissions.permissions.includes("admin") && (
          <>
            <NavLink href="/admin">Dashboard</NavLink>
            <NavLink href="/admin/products">Manage Products</NavLink>
            <NavLink href="/admin/users">Manage Customers</NavLink>
            <NavLink href="/admin/orders">Manage Sales</NavLink>
            <NavLink href="/admin/discount-codes">Manage Coupons</NavLink>
          </>
        )}
      </ul>

      <div aria-label="Authentication">
        {isAuthenticated ? (
          <LogoutLink className={linkClassNames}>Logout</LogoutLink>
        ) : (
          <LoginLink className={linkClassNames}>Sign in</LoginLink>
        )}
      </div>
    </nav>
  );
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  const pathname = usePathname();

  return (
    <li className="">
      <Link
        {...props}
        className={cn(
          "text-wrap text-center",
          linkClassNames,
          pathname === props.href ? "bg-background text-foreground" : ""
        )}
      />
    </li>
  );
}
