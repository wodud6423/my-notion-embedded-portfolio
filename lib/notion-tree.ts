import type { BlockObjectResponse } from "@notionhq/client"
import { getNotionClient, getNotionMainPageId } from "@/lib/notion"
import type { NotionPageMeta } from "@/types"

function inferCategoryFromTitle(title: string): string {
  const lower = title.toLowerCase()
  if (lower.includes("rtos")) return "RTOS"
  if (lower.includes("yocto")) return "Yocto"
  if (lower.includes("driver") || lower.includes("드라이버") || lower.includes("microcontroller") || lower.includes("micro")) return "Driver"
  if (lower.includes("kernel") || lower.includes("커널") || lower.includes("임베디드 리눅스") || lower.includes("embedded linux")) return "Kernel"
  return "Other"
}

function extractPageTitle(block: BlockObjectResponse): string {
  if (block.type === "child_page") {
    return block.child_page.title ?? ""
  }
  return ""
}

export async function fetchChildPages(
  pageId: string,
  parentId: string,
  depth: number
): Promise<NotionPageMeta[]> {
  const notion = getNotionClient()
  const pages: NotionPageMeta[] = []
  let cursor: string | undefined = undefined

  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
      page_size: 100,
    })

    for (const block of response.results as BlockObjectResponse[]) {
      if (block.type === "child_page") {
        const title = extractPageTitle(block)
        const id = block.id.replace(/-/g, "")
        pages.push({
          id: block.id,
          title,
          parentId,
          depth,
          notionUrl: `https://notion.so/${id}`,
        })
      }
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined
  } while (cursor)

  return pages
}

// BSP 개발 관련 세부 주제 페이지 목록 수집
// 반환: { pages: Depth-2 페이지 목록, parentMap: pageId → 부모 제목 }
export async function fetchBspSubPages(): Promise<{
  pages: NotionPageMeta[]
  parentMap: Map<string, string>
}> {
  const mainPageId = getNotionMainPageId()

  // Depth 1: 메인 페이지 직속 하위 페이지들
  const depth1Pages = await fetchChildPages(mainPageId, mainPageId, 1)

  // BSP 개발 관련 페이지만 필터링 (임베디드 기술 관련)
  const bspKeywords = ["rtos", "드라이버", "driver", "커널", "kernel", "microcontroller", "임베디드 리눅스", "yocto", "bsp", "embedded"]
  const excludeKeywords = ["코딩", "coding", "ai 툴", "ai tool", "이외", "참고"]

  const bspDepth1 = depth1Pages.filter((page) => {
    const lower = page.title.toLowerCase()
    const isExcluded = excludeKeywords.some((kw) => lower.includes(kw))
    if (isExcluded) return false
    return bspKeywords.some((kw) => lower.includes(kw))
  })

  // Depth 2: 각 BSP 연구 페이지의 세부 주제 페이지들 수집
  const parentMap = new Map<string, string>()
  const allDepth2Pages: NotionPageMeta[] = []

  for (const depth1Page of bspDepth1) {
    const depth2Pages = await fetchChildPages(depth1Page.id, depth1Page.id, 2)
    for (const page of depth2Pages) {
      parentMap.set(page.id, depth1Page.title)
    }
    allDepth2Pages.push(...depth2Pages)

    // Notion API 3 RPS 제한 준수 (400ms delay)
    await new Promise((resolve) => setTimeout(resolve, 400))
  }

  // parentMap에 inferredCategory도 추가 (LLM 힌트용)
  const categoryMap = new Map<string, string>()
  for (const depth1Page of bspDepth1) {
    categoryMap.set(depth1Page.id, inferCategoryFromTitle(depth1Page.title))
  }

  return { pages: allDepth2Pages, parentMap }
}

export { inferCategoryFromTitle }
