import React, { type ComponentProps } from "react";
import NavLink from "./NavLink";

export default function AdminLinks({
  isMobile,
  setIsSheetOpen,
}: {
  isMobile: boolean;
  setIsSheetOpen?: ComponentProps<typeof NavLink>["setIsSheetOpen"];
}) {
  return (
    <>
      <NavLink
        label="Dashboard"
        href="/admin"
        isMobile={isMobile}
        setIsSheetOpen={setIsSheetOpen}
      />
      <NavLink
        label="Manage Products"
        href="/admin/products"
        isMobile={isMobile}
        setIsSheetOpen={setIsSheetOpen}
      />
      <NavLink
        label="Manage Customers"
        href="/admin/users"
        isMobile={isMobile}
        setIsSheetOpen={setIsSheetOpen}
      />
      <NavLink
        label="Manage Sales"
        href="/admin/orders"
        isMobile={isMobile}
        setIsSheetOpen={setIsSheetOpen}
      />
      <NavLink
        label="Manage Coupons"
        href="/admin/discount-codes"
        isMobile={isMobile}
        setIsSheetOpen={setIsSheetOpen}
      />
    </>
  );
}
