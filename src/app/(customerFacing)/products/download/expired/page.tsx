import React from "react";
import { Button } from "@/components/ui/button";

export default function ExpiredProductPage() {
  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="mb-4 mt-8 text-4xl">Download link expired</h1>

      <Button href="/orders" size="lg">
        Get New Link
      </Button>
    </div>
  );
}
