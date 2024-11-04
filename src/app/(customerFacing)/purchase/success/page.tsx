import Link from "next/link";
import React from "react";

export default function PurchaseSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center text-balance">
      <h1 className="text-center text-3xl font-bold">Purchase successful</h1>

      <p className="mt-4 text-pretty">
        Thank you for your purchase. We will send you a confirmation email soon.
      </p>

      <Link
        href="/orders"
        className="underline underline-offset-2 outline-offset-2 transition-colors hover:text-muted-foreground"
      >
        Your orders.
      </Link>
    </div>
  );
}
