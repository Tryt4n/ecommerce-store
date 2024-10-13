"use client";

import React, { type ComponentProps } from "react";
import { IKImage } from "imagekitio-next";

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

type ImageProps = { isThumbnail?: boolean } & ComponentProps<typeof IKImage>;

export default function Image({ isThumbnail = false, ...props }: ImageProps) {
  return (
    <IKImage
      urlEndpoint={urlEndpoint}
      {...props}
      loading="lazy"
      lqip={{ active: true, quality: 5 }}
      transformation={[
        {
          height: props.height?.toString(),
          width: props.width?.toString(),
          raw: `${isThumbnail ? "n-ik_ml_thumbnail," : ""}l-image,i-Logo@@logo-black_with_padding.svg,w-100,h-100,lfo-top_right,t-false,l-end`, // It adds a watermark to the image
        },
      ]}
    />
  );
}
