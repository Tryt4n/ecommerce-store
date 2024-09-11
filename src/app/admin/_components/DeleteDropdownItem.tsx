"use client";

import React, { useTransition, type ComponentProps } from "react";
import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import type AdminDropdownMenu from "./AdminDropdownMenu";

export default function DeleteDropdownItem({
  promiseFn,
  id,
  disabled,
}: {
  promiseFn: ComponentProps<typeof AdminDropdownMenu>["deleteFn"];
  id: string;
  disabled?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <DropdownMenuItem
      className="cursor-pointer"
      variant="destructive"
      disabled={disabled || isPending}
      onClick={() =>
        startTransition(async () => {
          await promiseFn(id);
          router.refresh();
        })
      }
    >
      Delete
    </DropdownMenuItem>
  );
}
