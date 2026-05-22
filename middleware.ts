import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;

  // Allow login page and login API through unauthenticated
  if (req.nextUrl.pathname === "/admin" || req.nextUrl.pathname.startsWith("/api/admin/login")) {
    return NextResponse.next();
  }

  try {
    if (!token) throw new Error("No token");
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/admin", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
