"use client";

import React, { type ComponentProps } from "react";
import { useInView } from "react-intersection-observer";
import { IKImage } from "imagekitio-next";

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

type ImageProps = {
  containerClassNames?: string;
  containerStyles?: React.CSSProperties;
  customRawSize?: number;
  isThumbnail?: boolean;
} & ComponentProps<typeof IKImage>;

const defaultImageWidth = 440 as const;

export default function Image({
  containerClassNames,
  containerStyles,
  customRawSize = defaultImageWidth,
  isThumbnail = false,
  ...props
}: ImageProps) {
  // Use `react-intersection-observer`to load the image only when it needs to be displayed
  const { ref, inView } = useInView({
    triggerOnce: true, // Only once, when the image appears in the viewport
    rootMargin: "150% 0px", // For the image to appear before it is visible
  });

  if (isThumbnail) customRawSize = Number(props.width) || defaultImageWidth;
  const logoWidth = customRawSize * 0.2;

  return (
    <div
      ref={ref}
      className={`${props.height ? `h-[${props.height}px]` : ""}${props.width ? ` w-[${props.width}px]` : ""}${containerClassNames ? ` ${containerClassNames}` : ""}`}
      style={containerStyles ? containerStyles : undefined}
    >
      {inView && (
        <IKImage
          urlEndpoint={urlEndpoint}
          {...props}
          lqip={{ active: true, quality: 5 }}
          transformation={[
            {
              height: props.height?.toString(),
              width: props.width?.toString(),
              raw: `${!props.height && !props.width ? `w-${customRawSize},h-${customRawSize},` : ""}fo-center,cm-pad_resize,l-image,i-Logo@@logo-black_with_padding.svg,w-${logoWidth},h-${logoWidth},lfo-top_right,t-false,l-end`, // It adds a watermark to the image
            },
          ]}
        />
      )}
    </div>
  );
}
