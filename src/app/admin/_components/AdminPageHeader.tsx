import React from "react";

export default function AdminPageHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return <h1 className="mb-4 text-4xl">{children}</h1>;
}
