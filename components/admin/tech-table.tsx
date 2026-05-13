"use client"

import { ExternalLink, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FeedbackDialog } from "@/components/admin/feedback-dialog"
import type { CachedTechStack } from "@/types"

const CATEGORY_COLORS: Record<string, string> = {
  Kernel: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Driver: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  RTOS: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Yocto: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  Other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
}

const DIFFICULTY_LABELS: Record<string, string> = {
  Beginner: "초급",
  Intermediate: "중급",
  Advanced: "고급",
}

interface TechTableProps {
  items: CachedTechStack[]
}

export function TechTable({ items }: TechTableProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>분석된 기술 스택이 없습니다.</p>
        <p className="text-sm mt-1">위의 &quot;Notion 분석 시작&quot; 버튼을 눌러 분석을 시작하세요.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            <th className="pb-3 pr-4 font-medium">기술명</th>
            <th className="pb-3 pr-4 font-medium">카테고리</th>
            <th className="pb-3 pr-4 font-medium">난이도</th>
            <th className="pb-3 pr-4 font-medium">중요도</th>
            <th className="pb-3 font-medium">액션</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map((item) => (
            <tr key={item.id} className="py-3">
              <td className="py-3 pr-4 font-medium max-w-[200px] truncate">{item.title}</td>
              <td className="py-3 pr-4">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.Other}`}>
                  {item.category}
                </span>
              </td>
              <td className="py-3 pr-4 text-muted-foreground">
                {DIFFICULTY_LABELS[item.difficulty] ?? item.difficulty}
              </td>
              <td className="py-3 pr-4">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < item.importance ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                    />
                  ))}
                </div>
              </td>
              <td className="py-3">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" asChild className="gap-1">
                    <a href={item.notionUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Notion
                    </a>
                  </Button>
                  <FeedbackDialog techTitle={item.title} notionPageId={item.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-muted-foreground text-right">총 {items.length}개 기술 스택</p>
    </div>
  )
}
