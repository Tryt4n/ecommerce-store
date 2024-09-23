"use client";

import React from "react";
import { useAdminContext } from "../../_hooks/useAdminContext";
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
import TableHeadSortingButton from "../../_components/TableHeadSortingButton";
import DiscountDropdownMenu from "./DiscountDropdownMenu";
import TextWithSearchOption from "@/components/TextWithSearchOption";
import { Globe, Infinity, Minus } from "lucide-react";
import type { getDiscountCodes } from "@/db/adminData/discountCodes";
import type { NestedKeyOf } from "../../_context/AdminContext";

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
  const { data, sortData: sortDiscountCodes } =
    useAdminContext<typeof getDiscountCodes>();

  return (
    <Table className="overflow-x-auto">
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Is Active</span>
          </TableHead>
          <TableHeadSortingButton
            title="Code"
            className="text-center"
            sortingFn={() =>
              sortDiscountCodes(
                "code" as NestedKeyOf<(typeof discountCodes)[number]>,
                "asc",
                discountCodes as unknown as typeof data
              )
            }
          />
          <TableHeadSortingButton
            title="Discount"
            className="text-center"
            sortingFn={() =>
              sortDiscountCodes(
                "discountAmount" as NestedKeyOf<(typeof discountCodes)[number]>,
                "asc",
                discountCodes as unknown as typeof data
              )
            }
          />
          <TableHeadSortingButton
            title="Expires"
            className="text-center"
            sortingFn={() =>
              sortDiscountCodes(
                "expiresAt" as NestedKeyOf<(typeof discountCodes)[number]>,
                "asc",
                discountCodes as unknown as typeof data
              )
            }
          />
          <TableHeadSortingButton
            title="Remaining Uses"
            className="text-center"
            sortingFn={() =>
              sortDiscountCodes(
                "limit" as NestedKeyOf<(typeof discountCodes)[number]>,
                "asc",
                discountCodes as unknown as typeof data
              )
            }
          />
          <TableHeadSortingButton
            title="Orders"
            className="text-center"
            sortingFn={() =>
              sortDiscountCodes(
                "uses" as NestedKeyOf<(typeof discountCodes)[number]>,
                "desc",
                discountCodes as unknown as typeof data
              )
            }
          />
          <TableHeadSortingButton
            title="Products"
            className="text-center"
            sortingFn={() =>
              sortDiscountCodes(
                "products" as NestedKeyOf<(typeof discountCodes)[number]>,
                "desc",
                discountCodes as unknown as typeof data
              )
            }
          />
          <TableHeadSortingButton
            title="Categories"
            className="text-center"
            sortingFn={() =>
              sortDiscountCodes(
                "categories" as NestedKeyOf<(typeof discountCodes)[number]>,
                "desc",
                discountCodes as unknown as typeof data
              )
            }
          />
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
              <TextWithSearchOption text={discount.code} />
            </TableCell>

            <TableCell align="center" className="text-nowrap">
              <TextWithSearchOption
                text={formatDiscountCode(
                  discount.discountAmount,
                  discount.discountType
                )}
              />
            </TableCell>

            <TableCell align="center" className="text-nowrap">
              {discount.expiresAt ? (
                <TextWithSearchOption
                  text={dateFormatter(discount.expiresAt)}
                />
              ) : (
                <Minus />
              )}
            </TableCell>

            <TableCell align="center" className="text-nowrap">
              {discount.limit ? (
                <TextWithSearchOption
                  text={formatNumber(discount.limit - discount.uses)}
                />
              ) : (
                <Infinity />
              )}
            </TableCell>

            <TableCell align="center" className="text-nowrap">
              <TextWithSearchOption text={formatNumber(discount.uses)} />
            </TableCell>

            <TableCell align="center" width="100%">
              {discount.allProducts || discount.categories.length > 0 ? (
                <Globe />
              ) : (
                <TextWithSearchOption text={discount.products.join(", ")} />
              )}
            </TableCell>

            <TableCell align="center" width="100%" className="capitalize">
              {discount.categories.length > 0 ? (
                <TextWithSearchOption text={discount.categories.join(", ")} />
              ) : (
                <Minus />
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
