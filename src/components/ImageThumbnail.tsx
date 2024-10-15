import React, { type ComponentProps } from "react";
import Image from "./Image";

type ImageThumbnailProps = {
  thumbnailContainerClassNames?: string;
  thumbnailContainerStyles?: React.CSSProperties;
  children?: React.ReactNode;
} & ComponentProps<typeof Image>;

export default function ImageThumbnail({
  thumbnailContainerClassNames,
  thumbnailContainerStyles,
  children,
  ...image
}: ImageThumbnailProps) {
  return (
    <div
      className={`relative flex aspect-square max-h-[${image.width}px] max-w-[${image.width}px] items-center justify-center overflow-hidden${thumbnailContainerClassNames ? ` ${thumbnailContainerClassNames}` : ""}`}
      style={thumbnailContainerStyles ? thumbnailContainerStyles : undefined}
    >
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image {...image} isThumbnail />
      {children}
    </div>
  );
}
