import React from "react";
import NavbarLinks from "../common/NavbarLinks";
import type { NavbarProps } from "../../Navbar";

export default function NavbarDesktop({ authentication }: NavbarProps) {
  return (
    <NavbarLinks
      authentication={authentication}
      containerStyles="sticky top-0 flex justify-center bg-primary p-2 px-4 text-primary-foreground gap-4 [&>[data-navbar-list]]:flex-grow"
      listStyles="flex flex-grow flex-wrap justify-center gap-1"
      isMobile={false}
    />
  );
}
