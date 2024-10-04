"use client";

import React, { useTransition } from "react";
import { useAdminContext } from "../_hooks/useAdminContext";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { CustomAlertDialog } from "@/components/CustomAlertDialog";

export default function DeleteDropdownItem({
  promiseFn,
  id,
  disabled,
}: {
  promiseFn: (id: string) => Promise<void>;
  id: string;
  disabled?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const { refetchData } = useAdminContext();

  return (
    <CustomAlertDialog
      title="Are you sure you want to delete?"
      description="This action cannot be undone."
      actionText={isPending ? "Deleting..." : "Delete"}
      triggerElementDisabled={disabled || isPending}
      actionButtonVariant={"destructive"}
      onAction={() =>
        startTransition(async () => {
          await promiseFn(id).then(() => refetchData());
        })
      }
      triggerElement={
        <DropdownMenuItem
          className="cursor-pointer"
          variant="destructive"
          disabled={disabled || isPending}
          onSelect={(e) => e.preventDefault()}
        >
          {isPending ? "Deleting..." : "Delete"}
        </DropdownMenuItem>
      }
    />
  );
}
