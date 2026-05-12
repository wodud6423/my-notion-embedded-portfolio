import type { PageObjectResponse } from "@notionhq/client"
import type { TechStack, TechCategory, Difficulty } from "@/types"

// Notion 프로퍼티에서 텍스트 값 추출
function extractTitle(page: PageObjectResponse): string {
  const prop = page.properties["Title"]
  if (prop?.type === "title" && prop.title.length > 0) {
    return prop.title.map((t) => t.plain_text).join("")
  }
  return ""
}

// Notion Select 프로퍼티에서 값 추출
function extractSelect(page: PageObjectResponse, key: string): string {
  const prop = page.properties[key]
  if (prop?.type === "select" && prop.select) {
    return prop.select.name
  }
  return ""
}

// Notion Multi-select 프로퍼티에서 태그 배열 추출
function extractMultiSelect(page: PageObjectResponse, key: string): string[] {
  const prop = page.properties[key]
  if (prop?.type === "multi_select") {
    return prop.multi_select.map((s) => s.name)
  }
  return []
}

// Notion Rich text 프로퍼티에서 텍스트 추출
function extractRichText(page: PageObjectResponse, key: string): string {
  const prop = page.properties[key]
  if (prop?.type === "rich_text") {
    return prop.rich_text.map((t) => t.plain_text).join("")
  }
  return ""
}

// Notion Number 프로퍼티에서 숫자 추출
function extractNumber(page: PageObjectResponse, key: string): number {
  const prop = page.properties[key]
  if (prop?.type === "number" && prop.number !== null) {
    return prop.number
  }
  return 0
}

// Notion Created time 프로퍼티에서 날짜 문자열 추출
function extractCreatedTime(page: PageObjectResponse): string {
  const prop = page.properties["Created"]
  if (prop?.type === "created_time") {
    return prop.created_time
  }
  return page.created_time
}

// 유효한 TechCategory 값인지 검증
function parseTechCategory(value: string): TechCategory {
  const validCategories: TechCategory[] = ["Kernel", "Driver", "RTOS", "Yocto", "Other"]
  return validCategories.includes(value as TechCategory)
    ? (value as TechCategory)
    : "Other"
}

// 유효한 Difficulty 값인지 검증
function parseDifficulty(value: string): Difficulty {
  const validDifficulties: Difficulty[] = ["Beginner", "Intermediate", "Advanced"]
  return validDifficulties.includes(value as Difficulty)
    ? (value as Difficulty)
    : "Beginner"
}

// Notion PageObjectResponse → TechStack 변환
export function mapPageToTechStack(page: PageObjectResponse): TechStack {
  return {
    id: page.id,
    title: extractTitle(page),
    category: parseTechCategory(extractSelect(page, "Category")),
    tags: extractMultiSelect(page, "Tags"),
    summary: extractRichText(page, "Summary"),
    difficulty: parseDifficulty(extractSelect(page, "Difficulty")),
    importance: extractNumber(page, "Importance"),
    createdAt: extractCreatedTime(page),
  }
}
