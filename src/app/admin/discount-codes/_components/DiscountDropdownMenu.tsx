import React from "react";
import {
  deleteDiscountCode,
  toggleDiscountCodeActive,
  type getDiscountCodes,
} from "@/db/adminData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteDropdownItem from "../../_components/DeleteDropdownItem";
import ActiveToggleDropdownMenuItem from "../../_components/ActiveToggleDropdownMenuItem";
import { MoreVertical } from "lucide-react";

export default function DiscountDropdownMenu({
  discount,
  canDeactivate,
}: {
  discount: NonNullable<
    Awaited<ReturnType<typeof getDiscountCodes>>
  >["unexpiredDiscountCodes"][number];
  canDeactivate?: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="transition-all hover:text-slate-400">
        <MoreVertical />
        <span className="sr-only">Actions</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {canDeactivate && (
          <>
            <ActiveToggleDropdownMenuItem
              id={discount.id}
              isActive={discount.isActive}
              promiseFn={toggleDiscountCodeActive}
            />

            <DropdownMenuSeparator />
          </>
        )}

        <DeleteDropdownItem
          id={discount.id}
          disabled={discount._count.orders > 0}
          promiseFn={deleteDiscountCode}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
