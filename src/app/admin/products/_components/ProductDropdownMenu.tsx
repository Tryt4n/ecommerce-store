import React from "react";
import Link from "next/link";
import { deleteProduct } from "../_actions/products";
import {
  toggleProductAvailability,
  type getAllProducts,
} from "@/db/adminData/products";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ActiveToggleDropdownMenuItem from "../../_components/ActiveToggleDropdownMenuItem";
import DeleteDropdownItem from "../../_components/DeleteDropdownItem";
import { MoreVertical } from "lucide-react";

export default function ProductDropdownMenu({
  product,
}: {
  product: NonNullable<Awaited<ReturnType<typeof getAllProducts>>>[number];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="transition-all hover:text-slate-400">
        <MoreVertical />
        <span className="sr-only">Actions</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem asChild className="cursor-pointer">
          <a download href={`/products/${product.id}/download/productDetails`}>
            Download Details
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <ActiveToggleDropdownMenuItem
          id={product.id}
          productName={product.name}
          isActive={product.isAvailableForPurchase}
          promiseFn={toggleProductAvailability}
        />

        <DropdownMenuSeparator />

        <DeleteDropdownItem
          id={product.id}
          productName={product.name}
          disabled={product._count > 0}
          promiseFn={deleteProduct}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
