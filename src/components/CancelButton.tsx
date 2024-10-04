"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function CancelButton() {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      size="lg"
      type="button"
      onClick={() => router.back()}
    >
      Cancel
    </Button>
  );
}
