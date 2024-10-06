"use client";

import React from "react";
import { useProductsContext } from "../_hooks/useProductsContext";
import { Button } from "@/components/ui/button";
import { LayoutGrid, LayoutList } from "lucide-react";

export default function LayoutButton() {
  const { layout, setLayout } = useProductsContext();

  return (
    <Button
      variant="outline"
      onClick={() => setLayout(layout === "list" ? "grid" : "list")}
      aria-label="Toggle layout view between list and grid."
    >
      {layout === "list" ? <LayoutList /> : <LayoutGrid />}
    </Button>
  );
}
