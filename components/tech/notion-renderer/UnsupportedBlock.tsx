interface UnsupportedBlockProps {
  type: string
}

export function UnsupportedBlock({ type }: UnsupportedBlockProps) {
  if (process.env.NODE_ENV === "development") {
    return (
      <div className="rounded border border-dashed border-muted-foreground/30 px-3 py-1 text-xs text-muted-foreground/50">
        [미지원 블록: {type}]
      </div>
    )
  }
  return null
}
