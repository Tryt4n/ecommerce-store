import React from "react";
import { checkPermissions } from "@/lib/checkPermissions";
import AdminPageHeader from "../_components/AdminPageHeader";
import UsersTable from "./_components/UsersTable";

export default async function AdminUsersPage() {
  await checkPermissions("admin");

  return (
    <>
      <AdminPageHeader searchable>Customers</AdminPageHeader>
      <UsersTable />
    </>
  );
}
