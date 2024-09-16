import React, { type ComponentProps } from "react";
import { TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

type TableHeadSortingButtonProps = {
  title: string;
  sortingFn: () => void;
} & ComponentProps<typeof TableHead>;

export default function TableHeadSortingButton({
  title,
  sortingFn,
  ...props
}: TableHeadSortingButtonProps) {
  return (
    <TableHead {...props}>
      <Button variant="ghost" onClick={sortingFn}>
        {title}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    </TableHead>
  );
}
