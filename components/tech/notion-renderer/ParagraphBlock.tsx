import type { NotionBlock } from "@/types"
import { renderRichText, getBlockData } from "./NotionBlockRenderer"
import type { RichTextItem } from "./NotionBlockRenderer"

interface ParagraphBlockProps {
  block: NotionBlock
}

export function ParagraphBlock({ block }: ParagraphBlockProps) {
  const data = getBlockData<{ rich_text: RichTextItem[] }>(block, "paragraph")
  const richText = data?.rich_text ?? []

  if (richText.length === 0) {
    return <br />
  }

  return (
    <p className="leading-7 text-foreground">
      {renderRichText(richText)}
    </p>
  )
}
