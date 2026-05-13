import { NextRequest, NextResponse } from "next/server"
import { getNotionClient } from "@/lib/notion"

export const dynamic = "force-dynamic"

interface CommentRequestBody {
  pageId: string
  message: string
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as CommentRequestBody
    const { pageId, message } = body

    if (!pageId || !message?.trim()) {
      return NextResponse.json({ error: "pageId와 message는 필수입니다." }, { status: 400 })
    }

    const notion = getNotionClient()

    await notion.comments.create({
      parent: { page_id: pageId },
      rich_text: [{ type: "text", text: { content: message.trim() } }],
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[POST /api/admin/comment] 오류:", error)
    return NextResponse.json(
      { error: "코멘트 전송 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}
