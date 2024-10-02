import { NextResponse, type NextRequest } from "next/server";
import { getDownloadVerification } from "@/app/_actions/download";
// import { downloadProduct } from "@/lib/downloadProduct";

export async function GET(
  req: NextRequest,
  {
    params: { downloadVerificationId },
  }: { params: { downloadVerificationId: string } }
) {
  const data = await getDownloadVerification(downloadVerificationId);

  if (!data) {
    return NextResponse.redirect(
      new URL("/products/download/expired", req.url)
    );
  }

  // return await downloadProduct(data.product);
}
