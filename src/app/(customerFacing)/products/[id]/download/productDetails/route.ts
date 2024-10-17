import { notFound } from "next/navigation";
import { getProduct } from "@/db/userData/products";
import { generateProductPDF } from "@/lib/pdf/generateProductPDF";
import { NextResponse, type NextRequest } from "next/server";
import {
  testProductDescription,
  testProductSpecification,
} from "@/lib/test-data";

export async function GET(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const product = await getProduct(id);

  if (product == null) return notFound();

  const pdfBuffer = await generateProductPDF({
    ...product,
    specification: testProductSpecification,
    shortDescription: product.description,
    description: testProductDescription,
  });

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${product.name.replace(/ /g, "-")}_details.pdf"`,
    },
  });
}
