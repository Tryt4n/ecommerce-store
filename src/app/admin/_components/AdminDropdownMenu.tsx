import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import DeleteDropdownItem from "./DeleteDropdownItem";

export default function AdminDropdownMenu({
  deleteFn,
  id,
  name,
}: {
  deleteFn: (id: string) => Promise<undefined>;
  id: string;
  name: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="transition-all hover:text-slate-400">
        <MoreVertical />
        <span className="sr-only">{`${name}'s actions`}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DeleteDropdownItem id={id} promiseFn={deleteFn} productName={name} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
