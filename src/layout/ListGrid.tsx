import React from "react";

export default function ListGrid({ children }: { children: React.ReactNode }) {
  return (
    <ul className="mt-8 grid grid-cols-1 gap-x-4 gap-y-8 md:mt-6 md:grid-cols-2 lg:grid-cols-3">
      {children}
    </ul>
  );
}
