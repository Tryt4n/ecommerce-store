"use client";

import React, { type ComponentProps, type ReactElement } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Nav({
  children,
}: {
  children: ReactElement<typeof NavLink> | ReactElement<typeof NavLink>[];
}) {
  return (
    <nav className="flex justify-center bg-primary px-4 text-primary-foreground">
      {children}
    </nav>
  );
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  const pathname = usePathname();

  return (
    <Link
      {...props}
      className={cn(
        "p-4 hover:bg-secondary hover:text-secondary-foreground focus:bg-secondary focus:text-secondary-foreground",
        pathname === props.href ? "bg-background text-foreground" : ""
      )}
    />
  );
}
