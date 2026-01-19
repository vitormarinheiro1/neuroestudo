// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;

  // Se o usuário tentar acessar qualquer rota que comece com /dashboard,
  // /disciplines, etc., e não tiver token, redireciona.
  const protectedRoutes = [
    "/dashboard",
    "/disciplines",
    "/study",
    "/reviews",
    "/analytics",
    "/settings",
  ];

  const isProtectedRoute = protectedRoutes.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configura em quais caminhos o middleware deve rodar
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/disciplines/:path*",
    "/study/:path*",
    "/reviews/:path*",
  ],
};
