import { codeToHtml } from "shiki"
import type { NotionBlock } from "@/types"
import { getBlockData } from "./NotionBlockRenderer"
import type { RichTextItem } from "./NotionBlockRenderer"

interface CodeData {
  rich_text: RichTextItem[]
  language: string
  caption: RichTextItem[]
}

const SUPPORTED_LANGS = ["c", "cpp", "shell", "bash", "python", "makefile"] as const
type SupportedLang = (typeof SUPPORTED_LANGS)[number]

function isSupportedLang(lang: string): lang is SupportedLang {
  return (SUPPORTED_LANGS as readonly string[]).includes(lang)
}

interface CodeBlockProps {
  block: NotionBlock
}

export async function CodeBlock({ block }: CodeBlockProps) {
  const data = getBlockData<CodeData>(block, "code")
  const richText = data?.rich_text ?? []
  const captionItems = data?.caption ?? []
  const rawLang = data?.language ?? "plaintext"

  const plainText = richText.map((t) => t.plain_text).join("")
  const caption = captionItems.map((t) => t.plain_text).join("")
  const lang = isSupportedLang(rawLang) ? rawLang : "plaintext"

  const html = await codeToHtml(plainText, {
    lang,
    theme: "github-dark",
  })

  return (
    <figure className="my-4">
      <div
        className="overflow-x-auto rounded-lg text-sm [&>pre]:p-4"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {caption && (
        <figcaption className="mt-1 text-center text-xs text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
