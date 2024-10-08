"use client";

import React from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useWindowSize } from "@/hooks/useWindowSize";
import NavbarMobile from "./NavbarMobile";
import NavbarDesktop from "./NavbarDesktop";
import type { KindePermissions } from "@kinde-oss/kinde-auth-nextjs/types";

export type NavbarProps = {
  authentication: {
    isAuthenticated: boolean | null;
    permissions?: KindePermissions;
  };
};

export default function Navbar() {
  const { width } = useWindowSize();
  const { isAuthenticated, permissions } = useKindeBrowserClient();

  return (
    <>
      {width < 768 ? (
        <NavbarMobile
          authentication={{
            isAuthenticated,
            permissions,
          }}
        />
      ) : (
        <NavbarDesktop
          authentication={{
            isAuthenticated,
            permissions,
          }}
        />
      )}
    </>
  );
}
