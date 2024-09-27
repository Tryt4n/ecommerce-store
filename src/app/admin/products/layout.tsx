"use client";

import React from "react";
import { authenticator } from "@/lib/imagekit/files";
import { ImageKitProvider } from "imagekitio-next";

export default function AdminProductsPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ImageKitProvider
      publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
      authenticator={authenticator}
    >
      {children}
    </ImageKitProvider>
  );
}
