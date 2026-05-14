import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const COOKIE_NAME = "admin-token"
const PUBLIC_PATHS = ["/admin/login", "/api/admin/login", "/api/admin/logout"]

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET ?? ""
  return new TextEncoder().encode(secret)
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl

  // 로그인/로그아웃 API 및 로그인 페이지는 인증 없이 접근 가능
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p))) {
    return NextResponse.next()
  }

  const token = request.cookies.get(COOKIE_NAME)?.value

  if (!token) {
    const loginUrl = new URL("/admin/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  try {
    await jwtVerify(token, getJwtSecret())
    return NextResponse.next()
  } catch {
    const loginUrl = new URL("/admin/login", request.url)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
