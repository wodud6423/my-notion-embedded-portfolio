'use client'

import { useState, useEffect, useTransition } from "react"
import { useFilterStore } from "@/store/filter-store"
import { TechGrid } from "@/components/tech/tech-grid"
import { TechGridSkeleton } from "@/components/tech/tech-card-skeleton"
import type { TechStack, TechListResponse } from "@/types"

interface HomeTechListProps {
  initialItems: TechStack[]
}

export function HomeTechList({ initialItems }: HomeTechListProps) {
  const [items, setItems] = useState<TechStack[]>(initialItems)
  const [isPending, startTransition] = useTransition()

  const { category, tags, difficulty } = useFilterStore()

  useEffect(() => {
    const params = new URLSearchParams()
    if (category) params.set("category", category)
    if (tags.length > 0) params.set("tags", tags.join(","))
    if (difficulty) params.set("difficulty", difficulty)

    const query = params.toString()
    const controller = new AbortController()

    startTransition(async () => {
      try {
        const res = await fetch(`/api/tech${query ? `?${query}` : ""}`, {
          signal: controller.signal,
        })
        if (!res.ok) throw new Error(`API 오류: ${res.status}`)
        const data = (await res.json()) as TechListResponse
        setItems(data.items)
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          // 오류 시 기존 items 유지
        }
      }
    })

    return () => controller.abort()
  }, [category, tags, difficulty])

  if (isPending) {
    return <TechGridSkeleton />
  }

  return (
    <TechGrid
      items={items}
      emptyMessage="등록된 기술 스택이 없습니다."
      emptySubMessage="Notion 데이터베이스에 기술을 추가하거나 필터를 초기화하세요."
    />
  )
}
