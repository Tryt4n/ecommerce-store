"use client";

import React, { type ComponentProps } from "react";
import { IKImage } from "imagekitio-next";

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

type ImageProps = { isThumbnail?: boolean } & ComponentProps<typeof IKImage>;

export default function Image({ isThumbnail = false, ...props }: ImageProps) {
  const modifiedImageUrl =
    isThumbnail && props.src?.includes(urlEndpoint)
      ? props.src.replace(urlEndpoint, `${urlEndpoint}/tr:n-ik_ml_thumbnail`)
      : props.src;

  return (
    <IKImage
      urlEndpoint={urlEndpoint}
      {...props}
      src={modifiedImageUrl}
      loading="lazy"
      lqip={{ active: true, quality: 5 }}
    />
  );
}
