"use client";

import React, { type ComponentProps } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type PurchaseButtonProps = {
  id: string;
} & ComponentProps<typeof Button>;

export default function PurchaseButton({ id, ...props }: PurchaseButtonProps) {
  const router = useRouter();

  return (
    <Button
      size={"lg"}
      className="w-full"
      onClick={() => router.push(`/products/purchase/${id}`)}
      {...props}
    >
      Purchase
    </Button>
  );
}
