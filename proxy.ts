import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const COOKIE_NAME = "admin-token"
const LOGIN_URL = "/admin/login"

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET ?? ""
  return new TextEncoder().encode(secret)
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl

  // /admin/login은 인증 없이 접근 가능
  if (pathname === LOGIN_URL || pathname.startsWith("/admin/login")) {
    return NextResponse.next()
  }

  const token = request.cookies.get(COOKIE_NAME)?.value

  if (!token) {
    const loginUrl = new URL(LOGIN_URL, request.url)
    return NextResponse.redirect(loginUrl)
  }

  try {
    await jwtVerify(token, getJwtSecret())
    return NextResponse.next()
  } catch {
    const loginUrl = new URL(LOGIN_URL, request.url)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
