import React from "react";
import { getOrders } from "../_actions/orders";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatters";
import { deleteOrder } from "@/db/adminData";
import AdminDropdownMenu from "../../_components/AdminDropdownMenu";

export default async function OrdersTable() {
  const orders = await getOrders();

  if (orders?.length === 0 || !orders) return <p>No sales found</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Price Paid</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Orders Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.product.name}</TableCell>
            <TableCell>{order.user.email}</TableCell>
            <TableCell>
              {formatCurrency(order.pricePaidInCents / 100)}
            </TableCell>
            <TableCell className="text-center">
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
