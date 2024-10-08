"use client";

import React, { type ComponentProps } from "react";
import { useRouter } from "next/navigation";
import { CustomAlertDialog } from "@/components/CustomAlertDialog";
import { Button } from "@/components/ui/button";

export default function LoginLogout({
  isAuthenticated,
  containerStyles,
  buttonStyles,
  buttonVariant = "ghost",
}: {
  isAuthenticated: boolean | null;
  containerStyles?: string;
  buttonStyles?: string;
  buttonVariant?: ComponentProps<typeof Button>["variant"];
}) {
  const router = useRouter();

  return (
    <div className={containerStyles} aria-label="Authentication">
      {isAuthenticated ? (
        <CustomAlertDialog
          title="Are you sure you want to logout?"
          actionText="Logout"
          onAction={() => router.push("/api/auth/logout")}
          triggerElement={
            <Button
              variant={buttonVariant}
              type="button"
              className={`text-base${buttonStyles ? ` ${buttonStyles}` : ""}`}
            >
              Logout
            </Button>
          }
        />
      ) : (
        <Button
          href="/api/auth/login"
          variant={buttonVariant}
          type="button"
          className={`text-base${buttonStyles ? ` ${buttonStyles}` : ""}`}
        >
          Sign in
        </Button>
      )}
    </div>
  );
}
