import React from "react";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";

type SortableProps = {
  items: string[];
  setItems: React.Dispatch<React.SetStateAction<string[]>>;
  children: React.ReactNode;
};

export default function Sortable({ items, setItems, children }: SortableProps) {
  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id.toString());
        const newIndex = items.indexOf(over.id.toString());

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <DndContext onDragEnd={onDragEnd}>
      <SortableContext items={items}>{children}</SortableContext>
    </DndContext>
  );
}
