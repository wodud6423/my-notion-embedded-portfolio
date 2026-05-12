import type { NotionBlock } from "@/types"
import { renderRichText, getBlockData } from "./NotionBlockRenderer"
import type { RichTextItem } from "./NotionBlockRenderer"

interface BulletedListBlockProps {
  items: NotionBlock[]
}

export function BulletedListBlock({ items }: BulletedListBlockProps) {
  return (
    <ul className="my-1 ml-6 list-disc space-y-1">
      {items.map((block) => {
        const data = getBlockData<{ rich_text: RichTextItem[] }>(block, "bulleted_list_item")
        const richText = data?.rich_text ?? []
        return (
          <li key={block.id} className="leading-7 text-foreground">
            {renderRichText(richText)}
          </li>
        )
      })}
    </ul>
  )
}
