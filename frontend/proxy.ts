import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/login", "/register"];

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.includes(pathname);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // const accessToken = request.cookies.get("accessToken")?.value;

  // if (!accessToken) {
  //   const loginUrl = new URL("/login", request.url);

  //   loginUrl.searchParams.set("redirect", pathname);

  //   return NextResponse.redirect(loginUrl);
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)"],
};
