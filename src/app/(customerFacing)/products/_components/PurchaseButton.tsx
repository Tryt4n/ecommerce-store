"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PurchaseButton({ id }: { id: string }) {
  const router = useRouter();

  return (
    <Button
      size={"lg"}
      className="w-full"
      onClick={() => router.push(`/products/purchase/${id}`)}
    >
      Purchase
    </Button>
  );
}
