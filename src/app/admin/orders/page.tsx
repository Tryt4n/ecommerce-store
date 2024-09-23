import React from "react";
import AdminPageHeader from "../_components/AdminPageHeader";
import OrdersTable from "./_components/OrdersTable";

export default function AdminOrdersPage() {
  return (
    <>
      <AdminPageHeader searchable>Sales</AdminPageHeader>
      <OrdersTable />
    </>
  );
}
