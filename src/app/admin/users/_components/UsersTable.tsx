"use client";

import React from "react";
import { useAdminContext } from "../../_hooks/useAdminContext";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { deleteUser, type getUsers } from "@/db/adminData/users";
import {
  Table,
  TableRow,
  TableHead,
  TableHeader,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import AdminDropdownMenu from "../../_components/AdminDropdownMenu";
import TableHeadSortingButton from "../../_components/TableHeadSortingButton";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function UsersTable() {
  const { data: users, sortData: sortUsers } =
    useAdminContext<typeof getUsers>();

  if (!users) {
    return <LoadingSpinner size={64} aria-label="Loading customers..." />;
  }

  if (users?.length === 0 || !users) return <p>No customers found</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHeadSortingButton
            title="Email"
            className="text-center"
            sortingFn={() => sortUsers("email", "asc")}
          />
          <TableHeadSortingButton
            title="Orders"
            className="text-center"
            sortingFn={() => sortUsers("orders", "desc")}
          />
          <TableHeadSortingButton
            title="Value"
            className="text-center"
            sortingFn={() => sortUsers("ordersValue", "desc")}
          />
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell align="center">{user.email}</TableCell>
            <TableCell align="center">
              {formatNumber(user.orders?.length || 0)}
            </TableCell>
            <TableCell align="center">
              {formatCurrency(user.ordersValue / 100)}
            </TableCell>
            <TableCell align="right">
              <AdminDropdownMenu
                id={user.id}
                name={user.email}
                deleteFn={deleteUser}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
