import { NextResponse } from "next/server";

export function middleware(request) {
  if (request.nextUrl.pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/availability", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin"],
};
