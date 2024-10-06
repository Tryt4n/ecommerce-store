"use client";

import React from "react";
import { useProductsContext } from "../_hooks/useProductsContext";

export default function CustomLayoutListGrid({
  children,
}: {
  children: React.ReactNode;
}) {
  const { layout } = useProductsContext();

  const layoutClassName =
    layout === "grid"
      ? "grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3"
      : "flex flex-col gap-6";

  return <ul className={layoutClassName}>{children}</ul>;
}
