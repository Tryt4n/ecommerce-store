import React, { type ComponentProps } from "react";
import Image from "./Image";

type ImageThumbnailProps = {
  containerStyles?: string;
  children?: React.ReactNode;
} & ComponentProps<typeof Image>;

export default function ImageThumbnail({
  containerStyles,
  children,
  ...image
}: ImageThumbnailProps) {
  return (
    <div
      className={`relative flex aspect-square max-h-[${image.width}px] max-w-[${image.width}px] items-center justify-center overflow-hidden${containerStyles ? ` ${containerStyles}` : ""}`}
    >
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image {...image} isThumbnail />
      {children}
    </div>
  );
}
