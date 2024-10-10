import React, { type ComponentProps } from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import NavLinkListItem from "./NavLinkListItem";
import NavLink from "./NavLink";
import AdminLinks from "./AdminLinks";
import AdminAccordionLinks from "../mobile/AdminAccordionLinks";
import LoginLogout from "./LoginLogout";
import { Separator } from "@/components/ui/separator";
import type { NavbarProps } from "../../Navbar";

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
    <NavigationMenu className={`${containerStyles} w-full max-w-full`}>
      <div className="w-full">
        <NavigationMenuList
          className={`space-x-0 ${listStyles}`}
          aria-label="Page navigation"
        >
          <NavLinkListItem
            label="Home"
            href="/"
            setIsSheetOpen={setIsSheetOpen}
            isMobile={isMobile}
          />
          <NavLinkListItem
            label="Products"
            href="/products"
            setIsSheetOpen={setIsSheetOpen}
            isMobile={isMobile}
          />

          {isAuthenticated &&
            permissions &&
            !permissions.permissions?.includes("admin") && (
              <NavLinkListItem
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
                  <>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger
                        variant="ghost"
                        iconSize={16}
                        className="text-base"
                      >
                        Admin Links
                      </NavigationMenuTrigger>

                      <NavigationMenuContent>
                        <AdminLinks
                          isMobile={isMobile}
                          setIsSheetOpen={setIsSheetOpen}
                        />
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </>
                )}
              </>
            )}
        </NavigationMenuList>
      </div>

      <LoginLogout isAuthenticated={isAuthenticated} {...loginLogoutProps} />
    </NavigationMenu>
  );
}
