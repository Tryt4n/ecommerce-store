import { NextResponse, type NextRequest } from "next/server";
import { isValidPassword } from "./lib/isValidPassword";
import { parsedEnv } from "./lib/zod/env";

export async function middleware(req: NextRequest) {
  if ((await isAuthenticated(req)) === false) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": "Basic" },
    });
  }
}

async function isAuthenticated(req: NextRequest) {
  const authHeader =
    req.headers.get("Authorization") || req.headers.get("authorization");

  if (authHeader == null) return false;

  const [username, password] = Buffer.from(authHeader.split(" ")[1], "base64") // Decode base64, [1] because the returned value is "Basic <base64>"
    .toString()
    .split(":"); // "username:password"

  return (
    username === process.env.ADMIN_USERNAME &&
    (await isValidPassword(password, parsedEnv.HASHED_ADMIN_PASSWORD))
  );
}

export const config = {
  matcher: "/admin/:path*",
};
