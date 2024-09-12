"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

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