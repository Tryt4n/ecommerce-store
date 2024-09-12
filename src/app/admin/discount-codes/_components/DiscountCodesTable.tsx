import React from "react";
import {
  dateFormatter,
  formatDiscountCode,
  formatNumber,
} from "@/lib/formatters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DiscountDropdownMenu from "./DiscountDropdownMenu";
import { Globe, Infinity, Minus } from "lucide-react";
import type { getDiscountCodes } from "@/app/_actions/discounts";

type DiscountCodesTableProps = {
  discountCodes: NonNullable<
    Awaited<ReturnType<typeof getDiscountCodes>>
  >["unexpiredDiscountCodes"];
  isInactive?: boolean;
  canDeactivate?: boolean;
};

export default function DiscountCodesTable({
  discountCodes,
  isInactive = false,
  canDeactivate = false,
}: DiscountCodesTableProps) {
  return (
    <Table className="overflow-x-auto">
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Is Active</span>
          </TableHead>
          <TableHead className="text-center">Code</TableHead>
          <TableHead className="text-center">Discount</TableHead>
          <TableHead className="text-center">Expires</TableHead>
          <TableHead className="text-center">Remaining Uses</TableHead>
          <TableHead className="text-center">Orders</TableHead>
          <TableHead className="text-center">Products</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {discountCodes.map((discount) => (
          <TableRow key={discount.id}>
            <TableCell className="text-xl">
              {discount.isActive && !isInactive ? (
                <>
                  <span className="sr-only">Active</span>
                  <span aria-label="Coupon is active">✅</span>
                </>
              ) : (
                <>
                  <span className="sr-only">Inactive</span>
                  <span aria-label="Coupon is inactive">❌</span>
                </>
              )}
            </TableCell>

            <TableCell align="center" className="text-nowrap">
              {discount.code}
            </TableCell>

            <TableCell align="center" className="text-nowrap">
              {formatDiscountCode(
                discount.discountAmount,
                discount.discountType
              )}
            </TableCell>

            <TableCell align="center" className="text-nowrap">
              {discount.expiresAt ? (
                dateFormatter(discount.expiresAt)
              ) : (
                <Minus />
              )}
            </TableCell>

            <TableCell align="center" className="text-nowrap">
              {discount.limit ? (
                formatNumber(discount.limit - discount.uses)
              ) : (
                <Infinity />
              )}
            </TableCell>

            <TableCell align="center" className="text-nowrap">
              {formatNumber(discount._count.orders)}
            </TableCell>

            <TableCell align="center">
              {discount.allProducts ? (
                <Globe />
              ) : (
                discount.products.map((product) => product.name).join(", ")
              )}
            </TableCell>

            <TableCell
              title="More Actions"
              align="right"
              className="text-nowrap"
            >
              <DiscountDropdownMenu
                discount={discount}
                canDeactivate={canDeactivate}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
