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

// 메인 페이지의 callout 블록 중 BSP 관련 블록 ID를 찾는다
async function findBspCalloutId(mainPageId: string): Promise<string | null> {
  const notion = getNotionClient()
  const resp = await notion.blocks.children.list({ block_id: mainPageId, page_size: 50 })

  const bspKeywords = ["bsp", "개발 관련 연구", "임베디드", "embedded"]

  for (const block of resp.results as BlockObjectResponse[]) {
    if (block.type === "callout") {
      const text = block.callout.rich_text?.map((rt: { plain_text?: string }) => rt.plain_text ?? "").join("") ?? ""
      const lower = text.toLowerCase()
      if (bspKeywords.some((kw) => lower.includes(kw))) {
        return block.id
      }
    }
  }
  return null
}

// BSP 개발 관련 세부 주제 페이지 목록 수집
// 실제 구조: 메인 페이지 → callout("BSP 개발 관련") → child_page(카테고리) → child_page(세부 주제)
// 반환: { pages: 세부 주제 페이지 목록, parentMap: pageId → 부모 카테고리 제목 }
export async function fetchBspSubPages(): Promise<{
  pages: NotionPageMeta[]
  parentMap: Map<string, string>
}> {
  const mainPageId = getNotionMainPageId()

  // Step 1: BSP callout 블록 찾기
  const bspCalloutId = await findBspCalloutId(mainPageId)
  if (!bspCalloutId) {
    // fallback: callout 구조가 없으면 메인 페이지 직속 child_page에서 시도
    return fetchBspSubPagesFallback(mainPageId)
  }

  // Step 2: callout 하위의 카테고리 페이지들 (child_page) 수집
  const categoryPages = await fetchChildPages(bspCalloutId, mainPageId, 1)

  if (categoryPages.length === 0) {
    return fetchBspSubPagesFallback(mainPageId)
  }

  // Step 3: 각 카테고리 페이지 하위의 세부 주제 페이지들 수집 (분석 단위)
  // Depth 2 페이지가 인덱스(child_page 자식 보유) 이면 Depth 3을, 아니면 Depth 2 자체를 분석 대상으로 삼음
  const parentMap = new Map<string, string>()
  const allSubPages: NotionPageMeta[] = []

  for (const categoryPage of categoryPages) {
    const depth2Pages = await fetchChildPages(categoryPage.id, categoryPage.id, 2)
    await new Promise((resolve) => setTimeout(resolve, 200))

    for (const depth2Page of depth2Pages) {
      const depth3Pages = await fetchChildPages(depth2Page.id, depth2Page.id, 3)
      await new Promise((resolve) => setTimeout(resolve, 200))

      if (depth3Pages.length > 0) {
        // 인덱스 페이지: Depth 3이 실제 분석 대상
        for (const page of depth3Pages) {
          parentMap.set(page.id, categoryPage.title)
        }
        allSubPages.push(...depth3Pages)
      } else {
        // 직접 기술 내용 페이지: Depth 2 자체가 분석 대상
        parentMap.set(depth2Page.id, categoryPage.title)
        allSubPages.push(depth2Page)
      }
    }
  }

  return { pages: allSubPages, parentMap }
}

// fallback: 메인 페이지 직속 child_page 구조 처리 (기존 방식)
async function fetchBspSubPagesFallback(mainPageId: string): Promise<{
  pages: NotionPageMeta[]
  parentMap: Map<string, string>
}> {
  const depth1Pages = await fetchChildPages(mainPageId, mainPageId, 1)

  const bspKeywords = ["rtos", "드라이버", "driver", "커널", "kernel", "microcontroller", "임베디드 리눅스", "yocto", "bsp", "embedded"]
  const excludeKeywords = ["코딩", "coding", "ai 툴", "ai tool", "이외", "참고"]

  const bspDepth1 = depth1Pages.filter((page) => {
    const lower = page.title.toLowerCase()
    const isExcluded = excludeKeywords.some((kw) => lower.includes(kw))
    if (isExcluded) return false
    return bspKeywords.some((kw) => lower.includes(kw))
  })

  const parentMap = new Map<string, string>()
  const allDepth2Pages: NotionPageMeta[] = []

  for (const depth1Page of bspDepth1) {
    const depth2Pages = await fetchChildPages(depth1Page.id, depth1Page.id, 2)
    for (const page of depth2Pages) {
      parentMap.set(page.id, depth1Page.title)
    }
    allDepth2Pages.push(...depth2Pages)
    await new Promise((resolve) => setTimeout(resolve, 200))
  }

  return { pages: allDepth2Pages, parentMap }
}

export { inferCategoryFromTitle }
