import React, { type ComponentProps } from "react";
import Image from "./Image";

type ImageThumbnailProps = {
  containerClassNames?: string;
  containerStyles?: React.CSSProperties;
  imageClassNames?: ComponentProps<typeof Image>["className"];
  children?: React.ReactNode;
} & ComponentProps<typeof Image>;

export default function ImageThumbnail({
  containerClassNames,
  containerStyles,
  imageClassNames,
  children,
  ...image
}: ImageThumbnailProps) {
  return (
    <div
      className={`relative flex aspect-square max-h-[${image.width}px] max-w-[${image.width}px] items-center justify-center overflow-hidden${containerClassNames ? ` ${containerClassNames}` : ""}`}
      style={containerStyles ? containerStyles : undefined}
    >
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image
        {...image}
        isThumbnail
        className={imageClassNames ? imageClassNames : undefined}
      />
      {children}
    </div>
  );
}
