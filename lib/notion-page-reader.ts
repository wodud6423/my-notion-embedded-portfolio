import type { BlockObjectResponse, RichTextItemResponse } from "@notionhq/client"
import { getNotionClient } from "@/lib/notion"

const MAX_TEXT_LENGTH = 2000

function extractRichText(richText: RichTextItemResponse[]): string {
  return richText.map((rt) => rt.plain_text).join("")
}

function extractBlockText(block: BlockObjectResponse): string {
  switch (block.type) {
    case "paragraph":
      return extractRichText(block.paragraph.rich_text)
    case "heading_1":
      return extractRichText(block.heading_1.rich_text)
    case "heading_2":
      return extractRichText(block.heading_2.rich_text)
    case "heading_3":
      return extractRichText(block.heading_3.rich_text)
    case "bulleted_list_item":
      return extractRichText(block.bulleted_list_item.rich_text)
    case "numbered_list_item":
      return extractRichText(block.numbered_list_item.rich_text)
    case "to_do":
      return extractRichText(block.to_do.rich_text)
    case "toggle":
      return extractRichText(block.toggle.rich_text)
    case "quote":
      return extractRichText(block.quote.rich_text)
    case "callout":
      return extractRichText(block.callout.rich_text)
    case "code":
      return extractRichText(block.code.rich_text)
    default:
      return ""
  }
}

export function extractTextFromBlocks(blocks: BlockObjectResponse[]): string {
  const lines: string[] = []
  let totalLength = 0

  for (const block of blocks) {
    if (totalLength >= MAX_TEXT_LENGTH) break
    const text = extractBlockText(block).trim()
    if (text) {
      lines.push(text)
      totalLength += text.length
    }
  }

  const full = lines.join("\n")
  return full.length > MAX_TEXT_LENGTH ? full.slice(0, MAX_TEXT_LENGTH) : full
}

export async function fetchPageBlocks(pageId: string): Promise<BlockObjectResponse[]> {
  const notion = getNotionClient()
  const blocks: BlockObjectResponse[] = []
  let cursor: string | undefined = undefined

  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
      page_size: 100,
    })

    blocks.push(...(response.results as BlockObjectResponse[]))
    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined
  } while (cursor && blocks.length < 200)

  return blocks
}
