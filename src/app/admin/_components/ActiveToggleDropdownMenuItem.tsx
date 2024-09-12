"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  return (
    <DropdownMenuItem
      className="cursor-pointer"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await promiseFn(id, !isActive);
          router.refresh();
        })
      }
    >
      {isActive ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
  );
}
