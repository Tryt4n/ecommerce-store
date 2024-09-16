"use client";

import React from "react";
import { useAdminContext } from "../../_hooks/useAdminContext";
import { deleteOrder, type getOrders } from "@/db/adminData/orders";
import { formatCurrency } from "@/lib/formatters";
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
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Minus } from "lucide-react";

export default function OrdersTable() {
  const { data: orders, sortData: sortOrders } =
    useAdminContext<typeof getOrders>();

  if (!orders) {
    return <LoadingSpinner size={64} aria-label="Loading products..." />;
  }

  if (orders?.length === 0 || !orders) return <p>No sales found</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHeadSortingButton
            title="Product"
            sortingFn={() => sortOrders("product.name", "asc")}
          />
          <TableHeadSortingButton
            className="text-center"
            title="Customer"
            sortingFn={() => sortOrders("user.email", "asc")}
          />
          <TableHeadSortingButton
            className="text-center"
            title="Price Paid"
            sortingFn={() => sortOrders("pricePaidInCents", "asc")}
          />
          <TableHead className="text-center">Coupon</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Orders Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="text-nowrap">{order.product.name}</TableCell>

            <TableCell align="center" className="text-nowrap">
              {order.user.email}
            </TableCell>

            <TableCell align="center" className="text-nowrap">
              {formatCurrency(order.pricePaidInCents / 100)}
            </TableCell>

            <TableCell align="center" className="text-nowrap">
              {order.discountCode == null ? <Minus /> : order.discountCode.code}
            </TableCell>

            <TableCell align="right" className="text-nowrap">
              <AdminDropdownMenu
                id={order.id}
                name={order.product.name}
                deleteFn={deleteOrder}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
