import type { NotionBlock } from "@/types"
import { renderRichText, getBlockData } from "./NotionBlockRenderer"
import type { RichTextItem } from "./NotionBlockRenderer"

interface HeadingBlockProps {
  block: NotionBlock
  level: 1 | 2 | 3
}

export function HeadingBlock({ block, level }: HeadingBlockProps) {
  const key = `heading_${level}` as "heading_1" | "heading_2" | "heading_3"
  const data = getBlockData<{ rich_text: RichTextItem[] }>(block, key)
  const richText = data?.rich_text ?? []
  const content = renderRichText(richText)

  if (level === 1) {
    return <h2 className="mt-8 text-2xl font-bold tracking-tight">{content}</h2>
  }
  if (level === 2) {
    return <h3 className="mt-6 text-xl font-semibold">{content}</h3>
  }
  return <h4 className="mt-4 text-lg font-medium">{content}</h4>
}
