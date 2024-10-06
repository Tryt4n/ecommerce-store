import React from "react";
import FiltersButton from "../_components/FiltersButton";
import LayoutButton from "../_components/LayoutButton";

export default function ProductsHeader() {
  return (
    <header className="flex justify-between">
      <h2 className="text-3xl font-bold">Products</h2>

      <div className="flex gap-2 sm:gap-4">
        <FiltersButton />
        <LayoutButton />
      </div>
    </header>
  );
}
