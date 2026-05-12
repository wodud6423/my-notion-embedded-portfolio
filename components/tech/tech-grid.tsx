import { cn } from "@/lib/utils"
import { TechCard } from "@/components/tech/tech-card"
import type { TechStack } from "@/types"

interface TechGridProps {
  items: TechStack[]
  emptyMessage?: string
  emptySubMessage?: string
  className?: string
}

export function TechGrid({
  items,
  emptyMessage = "등록된 기술 스택이 없습니다.",
  emptySubMessage,
  className,
}: TechGridProps) {
  if (items.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-24 text-center", className)}>
        <p className="text-lg font-medium text-muted-foreground">{emptyMessage}</p>
        {emptySubMessage && (
          <p className="mt-1 text-sm text-muted-foreground">{emptySubMessage}</p>
        )}
      </div>
    )
  }

  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {items.map((tech) => (
        <TechCard key={tech.id} tech={tech} />
      ))}
    </div>
  )
}
