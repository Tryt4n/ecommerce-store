"use server";

import { NextResponse } from "next/server";
import type { getProduct } from "@/db/userData/products";

export async function downloadProductFile(
  file: NonNullable<Awaited<ReturnType<typeof getProduct>>>["productFile"]
) {
  if (!file) return;

  const response = await fetch(file.url);
  if (!response.ok) {
    throw new Error(`Failed to fetch file from ${file.url}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const productFile = Buffer.from(arrayBuffer);
  const size = productFile.length;
  const extension = file?.url.split(".").pop();

  return new NextResponse(productFile, {
    headers: {
      "Content-Disposition": `attachment; filename="${file.name}.${extension}"`,
      "Content-Length": size.toString(),
    },
  });
}
