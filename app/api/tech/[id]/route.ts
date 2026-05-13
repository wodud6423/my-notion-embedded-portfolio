import { NextRequest, NextResponse } from "next/server"
import type { BlockObjectResponse } from "@notionhq/client"
import { getNotionClient } from "@/lib/notion"
import { getTechCacheItems } from "@/lib/tech-cache"
import { splitBlocksBySection } from "@/lib/block-parser"
import type { TechStackDetail } from "@/types"

export const revalidate = 60

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(
  _request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id } = await params

    // 캐시에서 메타데이터 조회
    const allItems = await getTechCacheItems()
    const meta = allItems.find((item) => item.id === id)

    if (!meta) {
      return NextResponse.json({ error: "기술 스택을 찾을 수 없습니다." }, { status: 404 })
    }

    // Notion에서 블록 실시간 조회
    const notion = getNotionClient()
    const blocksResponse = await notion.blocks.children.list({ block_id: id })
    const blocks = blocksResponse.results as BlockObjectResponse[]
    const content = splitBlocksBySection(blocks)

    const result: TechStackDetail = { ...meta, content }
    return NextResponse.json(result)
  } catch (error) {
    console.error("[GET /api/tech/[id]] 오류:", error)
    return NextResponse.json(
      { error: "기술 상세 정보를 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}
