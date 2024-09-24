"use client";

import React, { type ComponentProps } from "react";
import { IKImage } from "imagekitio-next";

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

type ImageProps = ComponentProps<typeof IKImage>;

export default function Image({ ...props }: ImageProps) {
  return (
    <IKImage
      urlEndpoint={urlEndpoint}
      {...props}
      loading="lazy"
      lqip={{ active: true, quality: 5 }}
    />
  );
}
