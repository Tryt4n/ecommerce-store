import React from "react";
import {
  toggleDiscountCodeActive,
  type getDiscountCodes,
} from "@/db/adminData/discountCodes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteDropdownItem from "../../_components/DeleteDropdownItem";
import ActiveToggleDropdownMenuItem from "../../_components/ActiveToggleDropdownMenuItem";
import { MoreVertical } from "lucide-react";
import { deleteDiscountCode } from "../_actions/discounts";

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
              productName={discount.code}
              isActive={discount.isActive}
              promiseFn={toggleDiscountCodeActive}
            />

            <DropdownMenuSeparator />
          </>
        )}

        <DeleteDropdownItem
          id={discount.id}
          productName={discount.code}
          disabled={discount.uses > 0}
          promiseFn={deleteDiscountCode}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
