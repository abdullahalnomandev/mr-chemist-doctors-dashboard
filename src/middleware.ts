import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  // Check if the user is authenticated
  if (!token) {
    // Redirect to login if not authenticated and trying to access protected routes
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.search = `?callbackUrl=${encodeURIComponent(request.nextUrl.pathname)}`;
    return NextResponse.redirect(url);
  }

  // Check if user needs to change password
  // if (token.needsPasswordChange === true && !request.nextUrl.pathname.startsWith("/change-password")) {
  //   // Redirect to change password page
  //   const url = request.nextUrl.clone()
  //   url.pathname = "/change-password"
  //   return NextResponse.redirect(url)
  // }

  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    // Add paths that require authentication
    "/dashboard/:path*",
    // Add more protected routes as needed
  ],
};
