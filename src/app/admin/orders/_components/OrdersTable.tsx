"use client";

import React from "react";
import { useAdminContext } from "../../_hooks/useAdminContext";
import { deleteOrder, type getOrders } from "@/db/adminData/orders";
import { dateFormatter, formatCurrency } from "@/lib/formatters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AdminDropdownMenu from "../../_components/AdminDropdownMenu";
import TableHeadSortingButton from "../../_components/TableHeadSortingButton";
import TextWithSearchOption from "@/components/TextWithSearchOption";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Check, Minus, X } from "lucide-react";

export default function OrdersTable() {
  const { data: orders, sortData: sortOrders } =
    useAdminContext<typeof getOrders>();

  if (!orders) {
    return <LoadingSpinner size={64} aria-label="Loading products..." />;
  }

  if (orders?.length === 0 || !orders)
    return <p className="text-center">No sales found</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHeadSortingButton
            title="Date"
            className="text-center"
            sortingFn={() => sortOrders("createdAt", "desc")}
          />
          <TableHeadSortingButton
            title="Products"
            className="text-center"
            sortingFn={() => sortOrders("productNames", "asc")}
          />
          <TableHeadSortingButton
            className="text-center"
            title="Customer"
            sortingFn={() => sortOrders("userEmail", "asc")}
          />
          <TableHeadSortingButton
            className="text-center"
            title="Price Paid"
            sortingFn={() => sortOrders("pricePaidInCents", "asc")}
          />
          <TableHeadSortingButton
            className="text-center"
            title="Coupon"
            sortingFn={() => sortOrders("discountCode", "desc")}
          />
          <TableHeadSortingButton
            className="text-center"
            title="Paid"
            sortingFn={() => sortOrders("isPaid", "desc")}
          />
          <TableHead className="w-0">
            <span className="sr-only">Orders Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell align="center" className="text-nowrap">
              <TextWithSearchOption text={dateFormatter(order.createdAt)} />
            </TableCell>

            <TableCell align="center" className="text-nowrap">
              <TextWithSearchOption text={order.productNames} />
            </TableCell>

            <TableCell align="center" className="text-nowrap">
              <TextWithSearchOption text={order.userEmail} />
            </TableCell>

            <TableCell align="center" className="text-nowrap">
              <TextWithSearchOption
                text={formatCurrency(order.pricePaidInCents / 100)}
              />
            </TableCell>

            <TableCell align="center" className="text-nowrap">
              {order.discountCode == null ? (
                <Minus />
              ) : (
                <TextWithSearchOption text={order.discountCode} />
              )}
            </TableCell>

            <TableCell align="center" className="text-nowrap">
              {order.isPaid ? (
                <Check className="text-green-500" />
              ) : (
                <X className="text-red-500" />
              )}
            </TableCell>

            <TableCell align="right" className="text-nowrap">
              <AdminDropdownMenu
                id={order.id}
                name={order.productNames}
                deleteFn={deleteOrder}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
