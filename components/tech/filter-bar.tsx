'use client'

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFilterStore } from "@/store/filter-store"
import { TECH_CATEGORIES, DIFFICULTY_LABELS } from "@/lib/constants"
import type { TechCategory, Difficulty } from "@/types"

// 임베디드 도메인 공통 태그 목록
const COMMON_TAGS = [
  "GPIO", "UART", "I2C", "SPI", "DMA",
  "Interrupt", "PWM", "ADC", "USB", "CAN",
  "Ethernet", "Bluetooth", "Wi-Fi",
]

const CATEGORY_TABS: { value: TechCategory | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  ...TECH_CATEGORIES.filter((c) => c !== 'Other').map((c) => ({ value: c as TechCategory, label: c })),
]

export function FilterBar() {
  const { category, tags, difficulty, setCategory, toggleTag, setDifficulty, resetFilters } =
    useFilterStore()

  const hasActiveFilter = category !== null || tags.length > 0 || difficulty !== null

  function handleCategoryChange(value: string) {
    setCategory(value === 'all' ? null : (value as TechCategory))
  }

  function handleDifficultyChange(value: string) {
    setDifficulty(value === 'all' ? null : (value as Difficulty))
  }

  return (
    <div className="space-y-4">
      {/* 카테고리 탭 */}
      <Tabs value={category ?? 'all'} onValueChange={handleCategoryChange}>
        <TabsList className="flex h-auto flex-wrap gap-1 bg-transparent p-0">
          {CATEGORY_TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-full border border-input bg-background px-4 py-1.5 text-sm data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* 태그 필터 + 난이도 Select */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        {/* 태그 멀티 선택 */}
        <div className="flex flex-wrap gap-2">
          {COMMON_TAGS.map((tag) => {
            const isSelected = tags.includes(tag)
            return (
              <Badge
                key={tag}
                variant={isSelected ? "default" : "outline"}
                className="cursor-pointer select-none transition-colors hover:bg-primary/80 hover:text-primary-foreground"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            )
          })}
        </div>

        {/* 난이도 필터 */}
        <div className="shrink-0 sm:w-36">
          <Select value={difficulty ?? 'all'} onValueChange={handleDifficultyChange}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="난이도" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 난이도</SelectItem>
              {(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map((d) => (
                <SelectItem key={d} value={d}>
                  {DIFFICULTY_LABELS[d]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 필터 초기화 버튼 */}
      {hasActiveFilter && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {[
              category && `카테고리: ${category}`,
              tags.length > 0 && `태그 ${tags.length}개`,
              difficulty && `난이도: ${DIFFICULTY_LABELS[difficulty]}`,
            ]
              .filter(Boolean)
              .join(" · ")}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
            onClick={resetFilters}
          >
            <X className="size-3" />
            초기화
          </Button>
        </div>
      )}
    </div>
  )
}
