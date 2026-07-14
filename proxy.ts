import { NextRequest, NextResponse } from "next/server";

const AUTH_PATHS = ["/login", "/registration"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("refreshToken")?.value;
  const { pathname } = request.nextUrl;
  const isAuthPage = AUTH_PATHS.includes(pathname);

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/registration"],
};