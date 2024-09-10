import fs from "fs/promises";
import { NextResponse } from "next/server";
import type { Product } from "@prisma/client";

export async function downloadProduct(
  product: Partial<Product> & Required<Pick<Product, "name" | "filePath">>
) {
  const { size } = await fs.stat(product.filePath);
  const file = await fs.readFile(product.filePath);
  const extension = product.filePath.split(".").pop();

  return new NextResponse(file, {
    headers: {
      "Content-Disposition": `attachment; filename="${product.name}.${extension}"`,
      "Content-Length": size.toString(),
    },
  });
}
