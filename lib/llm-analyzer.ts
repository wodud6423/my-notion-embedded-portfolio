import Anthropic from "@anthropic-ai/sdk"
import { fetchPageBlocks, extractTextFromBlocks } from "@/lib/notion-page-reader"
import { inferCategoryFromTitle } from "@/lib/notion-tree"
import type { CachedTechStack, NotionPageMeta, TechCategory, Difficulty } from "@/types"

const MODEL = "claude-sonnet-4-6"
const MAX_TOKENS = 1024
const DELAY_MS = 400

interface LlmAnalysisInput {
  pageId: string
  pageTitle: string
  pageText: string
  parentTitle: string
  notionUrl: string
}

interface LlmTechStackResult {
  title: string
  category: TechCategory
  tags: string[]
  summary: string
  difficulty: Difficulty
  importance: number
}

function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다.")
  }
  return new Anthropic({ apiKey })
}

function buildPrompt(input: LlmAnalysisInput): string {
  return `부모 페이지: ${input.parentTitle}
페이지 제목: ${input.pageTitle}
페이지 내용:
${input.pageText || "(내용 없음)"}

위 임베디드 기술 학습 페이지를 분석하여 아래 JSON 형식으로만 응답하세요.
페이지가 특정 기술을 다루지 않거나 목차/인덱스/개요 페이지라면 null 만 반환하세요.

{
  "title": "간결한 기술명 (예: FreeRTOS Task 생성, Linux 디바이스 드라이버)",
  "category": "Kernel|Driver|RTOS|Yocto|Other",
  "tags": ["관련태그1", "관련태그2"],
  "summary": "기술 한 줄 요약 100자 이내",
  "difficulty": "Beginner|Intermediate|Advanced",
  "importance": 1~5 사이 정수
}`
}

export async function analyzePage(input: LlmAnalysisInput): Promise<CachedTechStack | null> {
  const client = getAnthropicClient()

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: "임베디드 시스템 기술 스택 분석기입니다. 주어진 Notion 학습 페이지에서 기술 정보를 JSON으로만 반환하세요. 마크다운 코드블록 없이 순수 JSON 또는 null만 반환하세요.",
    messages: [{ role: "user", content: buildPrompt(input) }],
  })

  const text = response.content
    .filter((c) => c.type === "text")
    .map((c) => c.text)
    .join("")
    .trim()

  if (text === "null" || text === "") return null

  try {
    const parsed = JSON.parse(text) as LlmTechStackResult | null
    if (!parsed) return null

    const validCategories: TechCategory[] = ["Kernel", "Driver", "RTOS", "Yocto", "Other"]
    const validDifficulties: Difficulty[] = ["Beginner", "Intermediate", "Advanced"]

    const category: TechCategory = validCategories.includes(parsed.category)
      ? parsed.category
      : (inferCategoryFromTitle(input.parentTitle) as TechCategory) || "Other"

    const difficulty: Difficulty = validDifficulties.includes(parsed.difficulty)
      ? parsed.difficulty
      : "Intermediate"

    const importance = Math.min(5, Math.max(1, Math.round(parsed.importance ?? 3)))

    return {
      id: input.pageId,
      notionPageId: input.pageId,
      notionUrl: input.notionUrl,
      title: parsed.title ?? input.pageTitle,
      category,
      tags: Array.isArray(parsed.tags) ? parsed.tags.filter((t) => typeof t === "string") : [],
      summary: typeof parsed.summary === "string" ? parsed.summary.slice(0, 100) : "",
      difficulty,
      importance,
      createdAt: new Date().toISOString(),
    }
  } catch {
    return null
  }
}

export async function analyzeAllPages(
  pages: NotionPageMeta[],
  parentMap: Map<string, string>
): Promise<CachedTechStack[]> {
  const results: CachedTechStack[] = []

  for (const page of pages) {
    try {
      const blocks = await fetchPageBlocks(page.id)
      const pageText = extractTextFromBlocks(blocks)
      const parentTitle = parentMap.get(page.id) ?? ""

      const result = await analyzePage({
        pageId: page.id,
        pageTitle: page.title,
        pageText,
        parentTitle,
        notionUrl: page.notionUrl,
      })

      if (result) {
        results.push(result)
      }
    } catch (error) {
      console.error(`[LLM] 페이지 분석 실패 (${page.title}):`, error)
    }

    // Notion API RPS 제한 + Claude API 순차 처리
    await new Promise((resolve) => setTimeout(resolve, DELAY_MS))
  }

  return results
}

export function generateChangeSummary(
  oldItems: CachedTechStack[],
  newItems: CachedTechStack[]
): string {
  const oldIds = new Set(oldItems.map((i) => i.id))
  const newIds = new Set(newItems.map((i) => i.id))

  const added = newItems.filter((i) => !oldIds.has(i.id)).length
  const removed = oldItems.filter((i) => !newIds.has(i.id)).length
  const total = newItems.length

  if (added === 0 && removed === 0) {
    return `총 ${total}개 기술 스택 유지 (변경 없음)`
  }

  const parts: string[] = []
  if (added > 0) parts.push(`${added}개 추가`)
  if (removed > 0) parts.push(`${removed}개 제거`)

  return `기술 ${parts.join(", ")} (총 ${total}개)`.slice(0, 50)
}
