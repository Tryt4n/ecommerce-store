import React from "react";
import { checkPermissions } from "@/lib/checkPermissions";
import AdminPageHeader from "../_components/AdminPageHeader";
import OrdersTable from "./_components/OrdersTable";

export default async function AdminOrdersPage() {
  await checkPermissions("admin");

  return (
    <>
      <AdminPageHeader searchable>Sales</AdminPageHeader>
      <OrdersTable />
    </>
  );
}
