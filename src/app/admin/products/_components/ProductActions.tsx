"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleProductAvailability } from "@/db/adminData";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function ActiveToggleDropdownItem({
  id,
  isAvailableForPurchase,
}: {
  id: string;
  isAvailableForPurchase: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <DropdownMenuItem
      className="cursor-pointer"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await toggleProductAvailability(id, !isAvailableForPurchase);
          router.refresh();
        })
      }
    >
      {isAvailableForPurchase ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
  );
}
