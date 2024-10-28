import React, { type ComponentProps } from "react";
import Image from "next/image";
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
import ShoppingCartHoverCard from "@/components/ShoppingCartHoverCard";
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
      {!isMobile && (
        <Image src="/logo-white.svg" alt="Site Logo" width={40} height={40} />
      )}

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

      {/* <LoginLogout isAuthenticated={isAuthenticated} {...loginLogoutProps} /> */}
      <div className="flex w-full items-center justify-end gap-4 md:w-auto">
        {!isMobile && <ShoppingCartHoverCard />}
        <LoginLogout isAuthenticated={isAuthenticated} {...loginLogoutProps} />
      </div>
    </NavigationMenu>
  );
}
