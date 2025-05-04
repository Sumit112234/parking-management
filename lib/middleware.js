import { NextResponse } from "next/server"

export async function middleware(request) {
  const session = request.cookies.get("session")

  // Check if the user is authenticated
  if (!session) {
    // If the user is trying to access a protected route, redirect to login
    if (isProtectedRoute(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    return NextResponse.next()
  }

  try {
    // Verify the session
    const response = await fetch(`${request.nextUrl.origin}/api/auth/verify`, {
      headers: {
        Cookie: `session=${session.value}`,
      },
    })

    const data = await response.json()

    // If the session is invalid, redirect to login
    if (!response.ok || !data.valid) {
      if (isProtectedRoute(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/login", request.url))
      }
      return NextResponse.next()
    }

    // Check role-based access
    if (isAdminRoute(request.nextUrl.pathname) && data.user.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)

    // On error, redirect to login if trying to access protected route
    if (isProtectedRoute(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    return NextResponse.next()
  }
}

// Define which routes are protected
function isProtectedRoute(pathname) {
  const protectedRoutes = ["/dashboard", "/admin", "/bookings", "/profile"]

  return protectedRoutes.some((route) => pathname.startsWith(route))
}

// Define which routes are admin-only
function isAdminRoute(pathname) {
  return pathname.startsWith("/admin")
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/bookings/:path*", "/profile/:path*", "/api/admin/:path*"],
}
