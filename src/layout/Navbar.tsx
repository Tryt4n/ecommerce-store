"use client";

import React, { type ComponentProps } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Button } from "@/components/ui/button";
import { CustomAlertDialog } from "@/components/CustomAlertDialog";

export default function Navbar() {
  const { isAuthenticated, permissions } = useKindeBrowserClient();
  const router = useRouter();

  return (
    <nav className="flex justify-center bg-primary p-2 px-4 text-primary-foreground">
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
          <CustomAlertDialog
            title="Are you sure you want to logout?"
            actionText="Logout"
            onAction={() => router.push("/api/auth/logout")}
            triggerElement={
              <Button variant="ghost" type="button" className="text-base">
                Logout
              </Button>
            }
          />
        ) : (
          <Button
            href="/api/auth/login"
            variant="ghost"
            type="button"
            className="text-base"
          >
            Sign in
          </Button>
        )}
      </div>
    </nav>
  );
}

export function NavLink(props: ComponentProps<typeof Button>) {
  const pathname = usePathname();

  return (
    <li className="">
      <Button
        {...props}
        variant="ghost"
        className={cn(
          "text-base",
          pathname === props.href ? "bg-background text-foreground" : ""
        )}
      />
    </li>
  );
}
