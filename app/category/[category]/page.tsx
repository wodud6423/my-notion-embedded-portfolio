import type { Metadata } from "next"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { TechGrid } from "@/components/tech/tech-grid"
import { TechGridSkeleton } from "@/components/tech/tech-card-skeleton"
import { TECH_CATEGORIES, NOTION_REVALIDATE_SECONDS } from "@/lib/constants"
import type { TechCategory, TechListResponse } from "@/types"

// ISR 캐싱 설정 (60초 재검증)
export const revalidate = 60

interface PageProps {
  params: Promise<{ category: string }>
}

// 카테고리별 동적 메타데이터 생성
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params
  return {
    title: `${category} 기술 스택`,
    description: `${category} 카테고리의 임베디드 기술 목록`,
  }
}

// 빌드 시 유효한 카테고리 경로 사전 생성
export async function generateStaticParams() {
  return TECH_CATEGORIES.filter((cat) => cat !== "Other").map((category) => ({
    category,
  }))
}

async function fetchTechByCategory(category: TechCategory): Promise<TechListResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"
  const res = await fetch(`${baseUrl}/api/tech?category=${category}`, {
    next: { revalidate: NOTION_REVALIDATE_SECONDS },
  })
  if (!res.ok) throw new Error(`기술 목록 조회 실패: ${res.status}`)
  return res.json() as Promise<TechListResponse>
}

// 데이터 패칭 + 그리드 렌더링 서버 컴포넌트 (Suspense 경계 안쪽)
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
        emptySubMessage={`Notion 데이터베이스에 ${category} 카테고리 항목을 추가하세요.`}
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
