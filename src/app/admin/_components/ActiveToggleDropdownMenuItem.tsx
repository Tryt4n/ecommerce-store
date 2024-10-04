"use client";

import React, { useTransition } from "react";
import { useToast } from "@/hooks/useToast";
import { useAdminContext } from "../_hooks/useAdminContext";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function ActiveToggleDropdownMenuItem({
  id,
  productName,
  promiseFn,
  isActive,
}: {
  id: string;
  productName: string;
  promiseFn: (id: string, isActive: boolean) => Promise<void>;
  isActive: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const { refetchData } = useAdminContext();
  const { toast } = useToast();

  return (
    <DropdownMenuItem
      className="cursor-pointer"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await promiseFn(id, !isActive).then(() => {
            refetchData();
            toast({
              title: isActive ? "Deactivated" : "Activated",
              description: `${productName} has been ${isActive ? "deactivated" : "activated."}`,
              variant: "success",
            });
          });
        })
      }
    >
      {isActive ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
  );
}
