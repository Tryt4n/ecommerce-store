import React from "react";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import type { UploadedImage } from "@/lib/imagekit/type";

type SortableProps = {
  items: UploadedImage[];
  setItems: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
  children: React.ReactNode;
};

export default function Sortable({ items, setItems, children }: SortableProps) {
  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(
          (item) => item.id === active.id.toString()
        );
        const newIndex = items.findIndex(
          (item) => item.id === over.id.toString()
        );

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <DndContext onDragEnd={onDragEnd}>
      <SortableContext items={items.map((item) => item.id)}>
        {children}
      </SortableContext>
    </DndContext>
  );
}
