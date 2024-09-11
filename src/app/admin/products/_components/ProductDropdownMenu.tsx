import React from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { ActiveToggleDropdownItem } from "./ProductActions";
import DeleteDropdownItem from "../../_components/DeleteDropdownItem";
import { deleteProduct } from "@/db/adminData";
import type { getProducts } from "@/db/data";

export default function ProductDropdownMenu({
  product,
}: {
  product: NonNullable<Awaited<ReturnType<typeof getProducts>>>[number];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="transition-all hover:text-slate-400">
        <MoreVertical />
        <span className="sr-only">Actions</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem asChild className="cursor-pointer">
          <a download href={`/admin/products/${product.id}/download`}>
            Download
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <ActiveToggleDropdownItem
          id={product.id}
          isAvailableForPurchase={product.isAvailableForPurchase}
        />

        <DropdownMenuSeparator />

        <DeleteDropdownItem
          id={product.id}
          disabled={product._count.orders > 0}
          promiseFn={deleteProduct}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
