"use client";

import React from "react";
import { useProductsContext } from "../_hooks/useProductsContext";
import { Button } from "@/components/ui/button";
import { LayoutGrid, LayoutList } from "lucide-react";

export default function LayoutButton() {
  const { layout, setLayout } = useProductsContext();

  function changeLayout() {
    const layoutLocalStorage = localStorage.getItem("productsLayout");

    setLayout(layout === "list" ? "grid" : "list");
    localStorage.setItem(
      "productsLayout",
      layoutLocalStorage === "list" ? "grid" : "list"
    );
  }

  return (
    <Button
      variant="outline"
      onClick={changeLayout}
      aria-label="Toggle layout view between list and grid."
    >
      {layout === "list" ? <LayoutList /> : <LayoutGrid />}
      <span className="sr-only">{`Current layout: ${layout}.`}</span>
    </Button>
  );
}
