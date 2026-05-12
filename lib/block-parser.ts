import type { BlockObjectResponse } from "@notionhq/client"
import type { NotionBlock } from "@/types"

// Notion BlockObjectResponse → NotionBlock 변환
export function mapBlockToNotionBlock(block: BlockObjectResponse): NotionBlock {
  return {
    id: block.id,
    type: block.type,
    content: block as unknown as Record<string, unknown>,
  }
}

// Notion 블록 배열에서 H2 섹션 기준으로 분리
// PRD 정의: ## 개념 (Concept), ## 구현 경험 (Implementation), ## 트러블슈팅 (Troubleshooting)
export function splitBlocksBySection(blocks: BlockObjectResponse[]): {
  concept: NotionBlock[]
  implementation: NotionBlock[]
  troubleshooting: NotionBlock[]
} {
  const result = {
    concept: [] as NotionBlock[],
    implementation: [] as NotionBlock[],
    troubleshooting: [] as NotionBlock[],
  }

  type SectionKey = keyof typeof result
  let currentSection: SectionKey | null = null

  for (const block of blocks) {
    // H2 헤딩 텍스트로 섹션 구분
    if (block.type === "heading_2") {
      const headingBlock = block as BlockObjectResponse & {
        heading_2: { rich_text: Array<{ plain_text: string }> }
      }
      const text = headingBlock.heading_2.rich_text
        .map((t) => t.plain_text)
        .join("")
        .toLowerCase()

      if (text.includes("개념") || text.includes("concept")) {
        currentSection = "concept"
      } else if (text.includes("구현") || text.includes("implementation")) {
        currentSection = "implementation"
      } else if (text.includes("트러블") || text.includes("troubleshoot")) {
        currentSection = "troubleshooting"
      }
      continue
    }

    if (currentSection) {
      result[currentSection].push(mapBlockToNotionBlock(block))
    }
  }

  return result
}
