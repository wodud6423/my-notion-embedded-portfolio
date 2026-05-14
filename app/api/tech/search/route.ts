import { NextRequest, NextResponse } from "next/server"
import { getTechCacheItems } from "@/lib/tech-cache"
import type { SearchResponse } from "@/types"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const keyword = searchParams.get("q")?.trim() ?? ""

    if (!keyword) {
      return NextResponse.json<SearchResponse>({ keyword: "", items: [], total: 0 })
    }

    const lower = keyword.toLowerCase()
    const allItems = await getTechCacheItems()

    const items = allItems.filter((item) =>
      item.title.toLowerCase().includes(lower) ||
      item.summary.toLowerCase().includes(lower) ||
      item.tags.some((tag) => tag.toLowerCase().includes(lower))
    )

    return NextResponse.json<SearchResponse>({ keyword, items, total: items.length })
  } catch (error) {
    console.error("[GET /api/tech/search] 오류:", error)
    return NextResponse.json({ error: "검색 중 오류가 발생했습니다." }, { status: 500 })
  }
}
