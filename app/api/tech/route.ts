import { NextRequest, NextResponse } from "next/server"
import type { PageObjectResponse } from "@notionhq/client"
import { getNotionClient, getNotionDatabaseId } from "@/lib/notion"
import { mapPageToTechStack } from "@/lib/tech-mapper"
import type { TechListResponse, TechCategory, Difficulty } from "@/types"

export const revalidate = 60

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") as TechCategory | null
    const tagsParam = searchParams.get("tags")
    const difficulty = searchParams.get("difficulty") as Difficulty | null

    const notion = getNotionClient()
    const databaseId = getNotionDatabaseId()

    // Notion API 필터 조건 구성
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: any[] = []

    if (category) {
      filters.push({
        property: "Category",
        select: { equals: category },
      })
    }

    if (difficulty) {
      filters.push({
        property: "Difficulty",
        select: { equals: difficulty },
      })
    }

    if (tagsParam) {
      const tags = tagsParam.split(",").filter(Boolean)
      tags.forEach((tag) => {
        filters.push({
          property: "Tags",
          multi_select: { contains: tag },
        })
      })
    }

    // v5 API: notion.databases.query() → notion.dataSources.query()
    const response = await notion.dataSources.query({
      data_source_id: databaseId,
      filter: filters.length > 0 ? { and: filters } : undefined,
      sorts: [{ property: "Importance", direction: "descending" }],
    })

    const items = response.results
      .filter((item): item is PageObjectResponse => item.object === "page")
      .map(mapPageToTechStack)

    const result: TechListResponse = {
      items,
      total: items.length,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[GET /api/tech] Notion API 오류:", error)
    return NextResponse.json(
      { error: "기술 스택 목록을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}
