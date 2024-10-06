import React from "react";
import LayoutButton from "../_components/LayoutButton";

export default function ProductsHeader() {
  return (
    <header className="flex justify-between">
      <h2 className="text-3xl font-bold">Products</h2>

      <LayoutButton />
    </header>
  );
}
