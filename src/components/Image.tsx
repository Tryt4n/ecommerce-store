"use client";

import React, { type ComponentProps } from "react";
import { useInView } from "react-intersection-observer";
import { IKImage } from "imagekitio-next";

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

type ImageProps = { isThumbnail?: boolean } & ComponentProps<typeof IKImage>;

export default function Image({ isThumbnail = false, ...props }: ImageProps) {
  // Use `react-intersection-observer`to load the image only when it needs to be displayed
  const { ref, inView } = useInView({
    triggerOnce: true, // Only once, when the image appears in the viewport
    rootMargin: "150% 0px", // For the image to appear before it is visible
  });

  return (
    <div ref={ref} className="relative h-full w-full">
      {inView && (
        <IKImage
          urlEndpoint={urlEndpoint}
          {...props}
          lqip={{ active: true, quality: 5 }}
          transformation={[
            {
              height: props.height?.toString(),
              width: props.width?.toString(),
              raw: `${isThumbnail ? "n-ik_ml_thumbnail," : ""}l-image,i-Logo@@logo-black_with_padding.svg,w-100,h-100,lfo-top_right,t-false,l-end`, // It adds a watermark to the image
            },
          ]}
        />
      )}
    </div>
  );
}
