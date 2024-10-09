"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useProductsContext } from "../_hooks/useProductsContext";

export default function ResetSearchQueryParamButton() {
  const { handleResetSearchQueryParam } = useProductsContext();

  return (
    <Button type="button" onClick={handleResetSearchQueryParam}>
      Reset
    </Button>
  );
}
