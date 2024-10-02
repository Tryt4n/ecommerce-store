import React from "react";

export default function SortImagesInfo({ length }: { length: number }) {
  return (
    <p className="pt-4 text-sm font-medium">
      Uploaded Images
      {length > 1 && (
        <span className="text-muted-foreground">
          &nbsp;(Sort images by dragging and dropping)
        </span>
      )}
    </p>
  );
}
