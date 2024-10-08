"use client";

import React, { type ComponentProps } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckSquare } from "lucide-react";

type NavLinkProps = {
  label: string;
  isMobile?: boolean;
  setIsSheetOpen?: (value: boolean) => void;
} & ComponentProps<typeof Button>;

export default function NavLink({
  label,
  isMobile = false,
  setIsSheetOpen,
  ...props
}: NavLinkProps) {
  const pathname = usePathname();

  return (
    <li>
      <Button
        {...props}
        variant={props.variant || "ghost"}
        className={cn(
          "text-base",
          isMobile ? "h-10 w-full text-lg text-primary" : "",
          pathname === props.href
            ? isMobile
              ? "relative bg-muted font-bold"
              : "bg-background text-foreground"
            : "",
          props.className ? props.className : ""
        )}
        aria-label={pathname === props.href ? "Current page" : undefined}
        onClick={
          setIsSheetOpen
            ? (e: any) => {
                setIsSheetOpen(false);
                props.onClick && props.onClick(e);
              }
            : (e: any) => props.onClick && props.onClick(e)
        }
      >
        {label}
        {isMobile && pathname === props.href && (
          <CheckSquare className="absolute right-8" />
        )}
      </Button>
    </li>
  );
}
