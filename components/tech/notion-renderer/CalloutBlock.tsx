import type { NotionBlock } from "@/types"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { renderRichText, getBlockData } from "./NotionBlockRenderer"
import type { RichTextItem } from "./NotionBlockRenderer"

interface CalloutIcon {
  type: string
  emoji?: string
}

interface CalloutData {
  rich_text: RichTextItem[]
  icon: CalloutIcon | null
}

interface CalloutBlockProps {
  block: NotionBlock
}

export function CalloutBlock({ block }: CalloutBlockProps) {
  const data = getBlockData<CalloutData>(block, "callout")
  const richText = data?.rich_text ?? []
  const icon = data?.icon

  return (
    <Alert>
      <AlertDescription className="flex items-start gap-2">
        {icon?.type === "emoji" && icon.emoji && (
          <span className="shrink-0 text-base leading-6">{icon.emoji}</span>
        )}
        <span>{renderRichText(richText)}</span>
      </AlertDescription>
    </Alert>
  )
}
