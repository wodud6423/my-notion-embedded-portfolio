import type { Metadata } from "next"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { TechGrid } from "@/components/tech/tech-grid"
import { TechGridSkeleton } from "@/components/tech/tech-card-skeleton"
import { TECH_CATEGORIES } from "@/lib/constants"
import { getTechCacheItems } from "@/lib/tech-cache"
import type { TechCategory, TechListResponse } from "@/types"

export const revalidate = 60

interface PageProps {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params
  return {
    title: `${category} 기술 스택`,
    description: `${category} 카테고리의 임베디드 기술 목록`,
  }
}

export async function generateStaticParams() {
  return TECH_CATEGORIES.filter((cat) => cat !== "Other").map((category) => ({
    category,
  }))
}

async function fetchTechByCategory(category: TechCategory): Promise<TechListResponse> {
  const allItems = await getTechCacheItems()
  const items = allItems
    .filter((item) => item.category === category)
    .sort((a, b) => b.importance - a.importance)
  return { items, total: items.length }
}

async function CategoryTechList({ category }: { category: TechCategory }) {
  let data: TechListResponse
  try {
    data = await fetchTechByCategory(category)
  } catch {
    data = { items: [], total: 0 }
  }

  return (
    <>
      <p className="mb-8 text-muted-foreground">{data.total}개의 기술 스택</p>
      <TechGrid
        items={data.items}
        emptyMessage="아직 등록된 기술 스택이 없습니다."
        emptySubMessage={`관리자 페이지에서 Notion 분석을 실행하세요.`}
      />
    </>
  )
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params

  const validCategories: string[] = [...TECH_CATEGORIES]
  if (!validCategories.includes(category)) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">{category}</h1>
      </div>

      <Suspense fallback={<><div className="mb-8 h-5 w-24 animate-pulse rounded bg-muted" /><TechGridSkeleton /></>}>
        <CategoryTechList category={category as TechCategory} />
      </Suspense>
    </div>
  )
}
