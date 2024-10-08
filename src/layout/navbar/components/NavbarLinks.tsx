import React, { type ComponentProps } from "react";
import NavLink from "./NavLink";
import AdminAccordionLinks from "./AdminAccordionLinks";
import AdminLinks from "./AdminLinks";
import LoginLogout from "./LoginLogout";
import { Separator } from "@/components/ui/separator";
import type { NavbarProps } from "../Navbar";

export default function NavbarLinks({
  authentication,
  setIsSheetOpen,
  isMobile,
  containerStyles,
  listStyles,
  loginLogoutProps,
}: {
  authentication: NavbarProps["authentication"];
  setIsSheetOpen?: ComponentProps<typeof NavLink>["setIsSheetOpen"];
  isMobile: boolean;
  containerStyles?: string;
  listStyles?: string;
  loginLogoutProps?: Omit<
    ComponentProps<typeof LoginLogout>,
    "isAuthenticated"
  >;
}) {
  const { isAuthenticated, permissions } = authentication;

  return (
    <nav className={containerStyles}>
      <div data-navbar-list>
        <ul className={listStyles} aria-label="Page navigation">
          <NavLink
            label="Home"
            href="/"
            setIsSheetOpen={setIsSheetOpen}
            isMobile={isMobile}
            onClick={() => console.log("Home clicked")}
          />
          <NavLink
            label="Products"
            href="/products"
            setIsSheetOpen={setIsSheetOpen}
            isMobile={isMobile}
          />

          {isAuthenticated &&
            permissions &&
            !permissions.permissions?.includes("admin") && (
              <NavLink
                label="My Orders"
                href="/orders"
                setIsSheetOpen={setIsSheetOpen}
                isMobile={isMobile}
              />
            )}

          {isAuthenticated &&
            permissions &&
            permissions.permissions?.includes("admin") && (
              <>
                {isMobile ? (
                  <>
                    <Separator />
                    <AdminAccordionLinks
                      isMobile={isMobile}
                      setIsSheetOpen={setIsSheetOpen}
                    />
                  </>
                ) : (
                  <AdminLinks
                    isMobile={isMobile}
                    setIsSheetOpen={setIsSheetOpen}
                  />
                )}
              </>
            )}
        </ul>
      </div>

      <LoginLogout isAuthenticated={isAuthenticated} {...loginLogoutProps} />
    </nav>
  );
}
