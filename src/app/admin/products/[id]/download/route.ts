import { notFound } from "next/navigation";
import { getProduct } from "@/db/adminData";
import fs from "fs/promises";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const product = await getProduct(id);

  if (product == null) return notFound();

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