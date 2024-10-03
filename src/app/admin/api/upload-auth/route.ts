import { NextResponse, type NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import crypto from "crypto";

const privateKey = process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY;

export async function GET(request: NextRequest) {
  const { getPermissions } = getKindeServerSession();
  const permissions = await getPermissions();

  if (!permissions?.permissions.includes("admin")) {
    redirect("/");
  }

  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") || crypto.randomUUID();
  const expire =
    searchParams.get("expire") ||
    (Math.floor(Date.now() / 1000) + 2400).toString();
  const privateAPIKey = privateKey;
  const signature = crypto
    .createHmac("sha1", privateAPIKey)
    .update(token + expire)
    .digest("hex");

  return NextResponse.json({
    token,
    expire,
    signature,
  });
}
