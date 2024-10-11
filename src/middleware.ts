import { withAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  return withAuth(req, {
    isReturnToCurrentPage: true, // Returns the user to the page they tried to visit
  });
}

export const config = {
  matcher: ["/admin/:path*", "/orders/:path*", "/products/:id/purchase"],
};
