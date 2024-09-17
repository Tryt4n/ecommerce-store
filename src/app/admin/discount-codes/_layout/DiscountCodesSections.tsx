"use client";

import React from "react";
import { useAdminContext } from "../../_hooks/useAdminContext";
import DiscountCodesTable from "../_components/DiscountCodesTable";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { getDiscountCodes } from "@/db/adminData/discountCodes";

export default function DiscountCodesSections() {
  const { data: discountCodes } = useAdminContext<typeof getDiscountCodes>();

  if (
    !discountCodes ||
    (!discountCodes.expiredDiscountCodes &&
      !discountCodes.unexpiredDiscountCodes)
  ) {
    return <LoadingSpinner size={64} aria-label="Loading coupons..." />;
  }

  return (
    <>
      <section>
        <h2 className="sr-only">Active Coupons</h2>

        {discountCodes?.unexpiredDiscountCodes ? (
          <DiscountCodesTable
            discountCodes={discountCodes.unexpiredDiscountCodes}
            canDeactivate
          />
        ) : (
          <p>No active coupons</p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-2xl">Expired Coupons</h2>

        {discountCodes?.expiredDiscountCodes ? (
          <DiscountCodesTable
            discountCodes={discountCodes.expiredDiscountCodes}
            isInactive
          />
        ) : (
          <p>No expired coupons</p>
        )}
      </section>
    </>
  );
}
