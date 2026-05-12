import { NextRequest, NextResponse } from "next/server"
import type { BlockObjectResponse, PageObjectResponse } from "@notionhq/client"
import { getNotionClient } from "@/lib/notion"
import { mapPageToTechStack } from "@/lib/tech-mapper"
import { splitBlocksBySection } from "@/lib/block-parser"
import type { TechStackDetail } from "@/types"

// ISR 캐싱: 60초마다 재검증
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
    const notion = getNotionClient()

    // 페이지 메타데이터 조회
    const page = await notion.pages.retrieve({ page_id: id }) as PageObjectResponse

    // 페이지 블록(본문) 조회
    const blocksResponse = await notion.blocks.children.list({ block_id: id })
    const blocks = blocksResponse.results as BlockObjectResponse[]

    // H2 헤딩 기준으로 섹션 분리
    const content = splitBlocksBySection(blocks)

    const result: TechStackDetail = {
      ...mapPageToTechStack(page),
      content,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[GET /api/tech/[id]] Notion API 오류:", error)
    return NextResponse.json(
      { error: "기술 상세 정보를 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}
