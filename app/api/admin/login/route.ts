import { NextRequest, NextResponse } from "next/server"
import { signAdminToken, getAdminPassword } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as { password?: string }
    const { password } = body

    if (!password || password !== getAdminPassword()) {
      return NextResponse.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 })
    }

    const token = await signAdminToken()

    const response = NextResponse.json({ success: true })
    response.cookies.set("admin-token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24시간
      path: "/",
    })

    return response
  } catch {
    return NextResponse.json({ error: "로그인 처리 중 오류가 발생했습니다." }, { status: 500 })
  }
}
