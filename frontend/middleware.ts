import { auth } from "@/auth"
import { NextResponse } from "next/server"

// List of public routes that don't require authentication
const publicRoutes = [
  '/signin', 
  '/signup', 
  '/api/auth',
  '/api/signup'
];

// List of protected API routes
const protectedApiRoutes = [
  '/api/tasks',
  '/api/tasks/',
];

export default auth((req) => {
  const { nextUrl } = req;
  const isPublicRoute = publicRoutes.some(route => 
    nextUrl.pathname.startsWith(route)
  );

  const isProtectedApiRoute = protectedApiRoutes.some(route =>
    nextUrl.pathname.startsWith(route)
  );

  // Allow access to public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Protect API routes
  if (isProtectedApiRoute && !req.auth) {
    return new NextResponse(
      JSON.stringify({ message: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Protect dashboard routes
  if (nextUrl.pathname.startsWith('/dashboard') && !req.auth) {
    return Response.redirect(new URL('/signin', req.url));
  }

  // Prevent authenticated users from accessing auth pages
  if ((nextUrl.pathname.startsWith('/signin') || 
       nextUrl.pathname.startsWith('/signup')) && 
      req.auth) {
    return Response.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/signin',
    '/signup',
    '/api/:path*',
  ]
}; 