"use client";

import React, { useTransition } from "react";
import { useAdminContext } from "../_hooks/useAdminContext";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function ActiveToggleDropdownMenuItem({
  id,
  promiseFn,
  isActive,
}: {
  id: string;
  promiseFn: (id: string, isActive: boolean) => Promise<void>;
  isActive: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const { refetchData } = useAdminContext();

  return (
    <DropdownMenuItem
      className="cursor-pointer"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await promiseFn(id, !isActive).then(() => refetchData());
        })
      }
    >
      {isActive ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
  );
}
