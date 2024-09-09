import React from "react";

export default function ListGrid({ children }: { children: React.ReactNode }) {
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {children}
    </ul>
  );
}
