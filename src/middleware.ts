import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Public routes
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

// Protected routes
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/subscribe(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const path = req.nextUrl.pathname;

  console.log(`[Middleware] Checking path: ${path}`);

  // Skip public routes
  if (isPublicRoute(req)) return;

  // Protect protected routes
  if (isProtectedRoute(req)) {
    const { userId } = await auth(); // Get the logged-in user ID
    if (!userId) {
      // Redirect unauthenticated users to sign-in
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next|favicon.ico).*)',
    '/(api|trpc)(.*)',
  ],
};
