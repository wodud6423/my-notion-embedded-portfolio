import type { NotionBlock } from "@/types"
import { renderRichText, getBlockData } from "./NotionBlockRenderer"
import type { RichTextItem } from "./NotionBlockRenderer"

interface QuoteBlockProps {
  block: NotionBlock
}

export function QuoteBlock({ block }: QuoteBlockProps) {
  const data = getBlockData<{ rich_text: RichTextItem[] }>(block, "quote")
  const richText = data?.rich_text ?? []

  return (
    <blockquote className="border-l-4 border-border pl-4 italic text-muted-foreground">
      {renderRichText(richText)}
    </blockquote>
  )
}
