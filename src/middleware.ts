import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const protectedPaths = ["/profile", "/apply", "/visa", "/messages", "/admin", "/flights", "/ai-counseling", "/scholarships"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (!session && isProtected) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, req.url));
  }

  if (pathname.startsWith("/admin")) {
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MEDIA_DIRECTOR")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (session.user.role === "MEDIA_DIRECTOR" && !pathname.startsWith("/admin/media")) {
      return NextResponse.redirect(new URL("/admin/media", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
