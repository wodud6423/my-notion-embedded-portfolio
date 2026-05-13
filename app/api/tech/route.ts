import { NextRequest, NextResponse } from "next/server"
import { getTechCacheItems } from "@/lib/tech-cache"
import type { TechListResponse, TechCategory, Difficulty } from "@/types"

export const revalidate = 60

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") as TechCategory | null
    const tagsParam = searchParams.get("tags")
    const difficulty = searchParams.get("difficulty") as Difficulty | null

    let items = await getTechCacheItems()

    if (category) {
      items = items.filter((item) => item.category === category)
    }

    if (difficulty) {
      items = items.filter((item) => item.difficulty === difficulty)
    }

    if (tagsParam) {
      const tags = tagsParam.split(",").filter(Boolean)
      items = items.filter((item) =>
        tags.every((tag) => item.tags.includes(tag))
      )
    }

    items = items.sort((a, b) => b.importance - a.importance)

    const result: TechListResponse = { items, total: items.length }
    return NextResponse.json(result)
  } catch (error) {
    console.error("[GET /api/tech] 오류:", error)
    return NextResponse.json(
      { error: "기술 스택 목록을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}
