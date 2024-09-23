import React from "react";
import AdminPageHeader from "../_components/AdminPageHeader";
import UsersTable from "./_components/UsersTable";

export default function AdminUsersPage() {
  return (
    <>
      <AdminPageHeader searchable>Customers</AdminPageHeader>
      <UsersTable />
    </>
  );
}
