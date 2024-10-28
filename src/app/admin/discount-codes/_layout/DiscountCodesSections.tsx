"use client";

import React from "react";
import { useAdminContext } from "../../_hooks/useAdminContext";
import DiscountCodesTable from "../_components/DiscountCodesTable";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { getDiscountCodes } from "@/db/adminData/discountCodes";
import { Separator } from "@/components/ui/separator";

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
    <div className="my-8">
      <section>
        <h2 className="mb-4 text-2xl">Unexpired Coupons</h2>

        {discountCodes?.unexpiredDiscountCodes.length > 0 ? (
          <DiscountCodesTable
            discountCodes={discountCodes.unexpiredDiscountCodes}
            canDeactivate
          />
        ) : (
          <p className="text-center">No active coupons</p>
        )}
      </section>

      <Separator className="my-10 -ml-[1.25%] w-[102.5%]" />

      <section>
        <h2 className="mb-4 text-2xl">Expired Coupons</h2>

        {discountCodes?.expiredDiscountCodes.length > 0 ? (
          <DiscountCodesTable
            discountCodes={discountCodes.expiredDiscountCodes}
            isInactive
          />
        ) : (
          <p className="text-center">No expired coupons</p>
        )}
      </section>
    </div>
  );
}
