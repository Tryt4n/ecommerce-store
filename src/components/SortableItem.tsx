"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "./ui/button";
import type { UploadedImage } from "@/lib/imagekit/type";

export default function SortableItem({
  item,
  children,
}: {
  item: UploadedImage;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="relative mx-auto h-[320px] w-[320px]"
    >
      <Button
        type="button"
        className="absolute bottom-4 right-4 z-50 cursor-move"
        aria-label="Move"
        {...attributes}
        {...listeners}
      >
        <svg viewBox="0 0 20 20" width="16" fill="#FFFFFF">
          <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
        </svg>
      </Button>
      {children}
    </li>
  );
}
