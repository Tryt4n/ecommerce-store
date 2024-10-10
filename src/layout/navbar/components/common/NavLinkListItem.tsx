import React, { type ComponentProps } from "react";
import { NavigationMenuItem } from "@/components/ui/navigation-menu";
import NavLink from "./NavLink";

export default function NavLinkListItem({
  ...props
}: ComponentProps<typeof NavLink>) {
  return (
    <NavigationMenuItem className={props.isMobile ? "w-full" : undefined}>
      <NavLink {...props} />
    </NavigationMenuItem>
  );
}
