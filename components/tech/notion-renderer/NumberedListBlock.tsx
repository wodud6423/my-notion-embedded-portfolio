import type { NotionBlock } from "@/types"
import { renderRichText, getBlockData } from "./NotionBlockRenderer"
import type { RichTextItem } from "./NotionBlockRenderer"

interface NumberedListBlockProps {
  items: NotionBlock[]
}

export function NumberedListBlock({ items }: NumberedListBlockProps) {
  return (
    <ol className="my-1 ml-6 list-decimal space-y-1">
      {items.map((block) => {
        const data = getBlockData<{ rich_text: RichTextItem[] }>(block, "numbered_list_item")
        const richText = data?.rich_text ?? []
        return (
          <li key={block.id} className="leading-7 text-foreground">
            {renderRichText(richText)}
          </li>
        )
      })}
    </ol>
  )
}
