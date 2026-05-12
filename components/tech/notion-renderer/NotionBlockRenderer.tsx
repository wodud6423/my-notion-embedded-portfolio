import type { ReactNode } from "react"
import type { NotionBlock } from "@/types"
import { ParagraphBlock } from "./ParagraphBlock"
import { HeadingBlock } from "./HeadingBlock"
import { BulletedListBlock } from "./BulletedListBlock"
import { NumberedListBlock } from "./NumberedListBlock"
import { QuoteBlock } from "./QuoteBlock"
import { DividerBlock } from "./DividerBlock"
import { CalloutBlock } from "./CalloutBlock"
import { CodeBlock } from "./CodeBlock"
import { UnsupportedBlock } from "./UnsupportedBlock"

export interface RichTextItem {
  plain_text: string
  href: string | null
  annotations: {
    bold: boolean
    italic: boolean
    code: boolean
    strikethrough: boolean
    underline: boolean
    color: string
  }
}

export function renderRichText(items: RichTextItem[]): ReactNode[] {
  return items.map((item, index) => {
    let node: ReactNode = item.plain_text

    if (item.annotations.code) {
      node = (
        <code key={index} className="rounded bg-muted px-1 font-mono text-sm">
          {node}
        </code>
      )
    } else {
      if (item.annotations.bold && item.annotations.italic) {
        node = <strong key={index}><em>{node}</em></strong>
      } else if (item.annotations.bold) {
        node = <strong key={index}>{node}</strong>
      } else if (item.annotations.italic) {
        node = <em key={index}>{node}</em>
      } else if (item.annotations.strikethrough) {
        node = <s key={index}>{node}</s>
      } else if (item.annotations.underline) {
        node = <span key={index} className="underline">{node}</span>
      } else {
        node = <span key={index}>{node}</span>
      }
    }

    if (item.href) {
      node = (
        <a
          key={index}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-4 hover:opacity-80"
        >
          {node}
        </a>
      )
    }

    return node
  })
}

export function getBlockData<T>(block: NotionBlock, type: string): T {
  return (block.content as Record<string, unknown>)[type] as T
}

interface BlockSwitchProps {
  block: NotionBlock
}

function BlockSwitch({ block }: BlockSwitchProps) {
  switch (block.type) {
    case "paragraph":
      return <ParagraphBlock block={block} />
    case "heading_1":
      return <HeadingBlock block={block} level={1} />
    case "heading_2":
      return <HeadingBlock block={block} level={2} />
    case "heading_3":
      return <HeadingBlock block={block} level={3} />
    case "quote":
      return <QuoteBlock block={block} />
    case "divider":
      return <DividerBlock />
    case "callout":
      return <CalloutBlock block={block} />
    // bulleted/numbered/code는 NotionBlockRenderer에서 별도 처리
    default:
      return <UnsupportedBlock type={block.type} />
  }
}

interface NotionBlockRendererProps {
  blocks: NotionBlock[]
}

export function NotionBlockRenderer({ blocks }: NotionBlockRendererProps) {
  const elements: ReactNode[] = []
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i]

    // bulleted_list_item 연속 그룹화
    if (block.type === "bulleted_list_item") {
      const group: NotionBlock[] = []
      while (i < blocks.length && blocks[i].type === "bulleted_list_item") {
        group.push(blocks[i])
        i++
      }
      elements.push(<BulletedListBlock key={`bulleted-${group[0].id}`} items={group} />)
      continue
    }

    // numbered_list_item 연속 그룹화
    if (block.type === "numbered_list_item") {
      const group: NotionBlock[] = []
      while (i < blocks.length && blocks[i].type === "numbered_list_item") {
        group.push(blocks[i])
        i++
      }
      elements.push(<NumberedListBlock key={`numbered-${group[0].id}`} items={group} />)
      continue
    }

    // code 블록은 async 컴포넌트이므로 직접 처리
    if (block.type === "code") {
      elements.push(<CodeBlock key={block.id} block={block} />)
      i++
      continue
    }

    elements.push(<BlockSwitch key={block.id} block={block} />)
    i++
  }

  return <div className="space-y-4">{elements}</div>
}
