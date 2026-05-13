import { NextResponse } from "next/server"
import { fetchBspSubPages } from "@/lib/notion-tree"
import { analyzeAllPages, generateChangeSummary } from "@/lib/llm-analyzer"
import { readTechCache, writeTechCache } from "@/lib/tech-cache"
import type { AdminAnalyzeResponse } from "@/types"

export const dynamic = "force-dynamic"
export const maxDuration = 300

export async function POST(): Promise<NextResponse> {
  try {
    // Notion 페이지 트리 탐색
    const { pages, parentMap } = await fetchBspSubPages()

    if (pages.length === 0) {
      return NextResponse.json<AdminAnalyzeResponse>({
        success: false,
        updatedAt: new Date().toISOString(),
        updatedSummary: "분석할 페이지를 찾지 못했습니다.",
        itemCount: 0,
        error: "BSP 연구 페이지 하위에 분석할 페이지가 없습니다.",
      }, { status: 404 })
    }

    // 기존 캐시 조회
    const existingCache = await readTechCache()
    const oldItems = existingCache?.items ?? []

    // LLM 분석
    const newItems = await analyzeAllPages(pages, parentMap)

    // 변경 요약 생성
    const updatedSummary = generateChangeSummary(oldItems, newItems)
    const updatedAt = new Date().toISOString()

    // 캐시 저장
    await writeTechCache({ updatedAt, updatedSummary, items: newItems })

    return NextResponse.json<AdminAnalyzeResponse>({
      success: true,
      updatedAt,
      updatedSummary,
      itemCount: newItems.length,
    })
  } catch (error) {
    console.error("[POST /api/admin/analyze] 오류:", error)
    return NextResponse.json<AdminAnalyzeResponse>({
      success: false,
      updatedAt: new Date().toISOString(),
      updatedSummary: "",
      itemCount: 0,
      error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
    }, { status: 500 })
  }
}
