import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { DIFFICULTY_LABELS } from "@/lib/constants"
import type { TechStack } from "@/types"

interface TechCardProps {
  tech: TechStack
  className?: string
}

// 난이도별 배지 색상 클래스
const difficultyVariant: Record<string, "default" | "secondary" | "destructive"> = {
  Beginner: "secondary",
  Intermediate: "default",
  Advanced: "destructive",
}

// 중요도(1~5)를 시각적 별 문자열로 변환
function renderImportance(importance: number): string {
  const clamped = Math.min(5, Math.max(1, importance))
  return "★".repeat(clamped) + "☆".repeat(5 - clamped)
}

export function TechCard({ tech, className }: TechCardProps) {
  return (
    <Link href={`/tech/${tech.id}`} className="block">
      <Card className={cn("h-full transition-shadow hover:shadow-md", className)}>
        <CardHeader>
          <div className="mb-2 flex items-start justify-between gap-2">
            <Badge variant="outline" className="text-xs">
              {tech.category}
            </Badge>
            <Badge variant={difficultyVariant[tech.difficulty] ?? "secondary"} className="text-xs">
              {DIFFICULTY_LABELS[tech.difficulty]}
            </Badge>
          </div>
          <CardTitle className="text-base leading-snug">{tech.title}</CardTitle>
          <CardDescription className="line-clamp-2 text-sm">{tech.summary}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* 태그 목록 */}
          <div className="flex flex-wrap gap-1">
            {tech.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
            {tech.tags.length > 5 && (
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                +{tech.tags.length - 5}
              </span>
            )}
          </div>
          {/* 중요도 표시 */}
          <p className="mt-3 text-xs text-muted-foreground" aria-label={`중요도 ${tech.importance}점`}>
            {renderImportance(tech.importance)}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
