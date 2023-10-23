import withAuth, { NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const pathname = req.nextUrl.pathname;
    const protectedRoutes = config.matcher;
    if (protectedRoutes.includes(pathname) && !req.nextauth.token) {
      return NextResponse.rewrite(new URL("/api/auth/signin"));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/", "/product/:path*", "/purchase/:path*", "/vendor/:path*"],
};
