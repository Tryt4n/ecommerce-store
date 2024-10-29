"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

export default function TextWithSearchOption({ text }: { text: string }) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("searchQuery");

  const parts = text?.split(new RegExp(`(${searchQuery})`, "gi")); // Split the text into parts, where the search query is a separate part

  return (
    <>
      {searchQuery ? (
        <span>
          {parts.map((part, index) =>
            part.toLowerCase() === searchQuery.toLowerCase() ? (
              <mark key={index} className="bg-[#fc9a23]">
                {part}
              </mark>
            ) : (
              part
            )
          )}
        </span>
      ) : (
        text
      )}
    </>
  );
}
