import { notFound } from "next/navigation";
import { getProduct } from "@/db/userData/products";
import { downloadProductFile } from "@/lib/downloadProductFIle";
import type { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const product = await getProduct(id);

  if (product == null) return notFound();

  return await downloadProductFile(product.productFile);
}
