import React from "react";
import { getOrders } from "../_actions/orders";
import { deleteOrder } from "@/db/adminData/orders";
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
import { Minus } from "lucide-react";

export default async function OrdersTable() {
  const orders = await getOrders();

  if (orders?.length === 0 || !orders) return <p>No sales found</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead className="text-center">Customer</TableHead>
          <TableHead className="text-center">Price Paid</TableHead>
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
