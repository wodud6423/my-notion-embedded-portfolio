import { NextRequest, NextResponse } from "next/server"
import type { PageObjectResponse } from "@notionhq/client"
import { getNotionClient, getNotionDatabaseId } from "@/lib/notion"
import { mapPageToTechStack } from "@/lib/tech-mapper"
import type { SearchResponse } from "@/types"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const keyword = searchParams.get("q")?.trim() ?? ""

    if (!keyword) {
      return NextResponse.json<SearchResponse>({
        keyword: "",
        items: [],
        total: 0,
      })
    }

    const notion = getNotionClient()
    const databaseId = getNotionDatabaseId()

    // Notion에서 기술명(Title) 또는 요약(Summary) 필드로 검색
    // v5 API: notion.databases.query() → notion.dataSources.query()
    const response = await notion.dataSources.query({
      data_source_id: databaseId,
      filter: {
        or: [
          {
            property: "Title",
            title: { contains: keyword },
          },
          {
            property: "Summary",
            rich_text: { contains: keyword },
          },
        ],
      },
      sorts: [{ property: "Importance", direction: "descending" }],
    })

    const items = response.results
      .filter((item): item is PageObjectResponse => item.object === "page")
      .map(mapPageToTechStack)

    const result: SearchResponse = {
      keyword,
      items,
      total: items.length,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[GET /api/tech/search] Notion API 오류:", error)
    return NextResponse.json(
      { error: "검색 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}
