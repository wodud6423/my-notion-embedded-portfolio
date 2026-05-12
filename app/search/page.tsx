import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TechGrid } from "@/components/tech/tech-grid"
import { TechGridSkeleton } from "@/components/tech/tech-card-skeleton"
import { SearchInput } from "@/components/layout/search-input"
import { NOTION_REVALIDATE_SECONDS } from "@/lib/constants"
import type { SearchResponse } from "@/types"

export const revalidate = 60

interface PageProps {
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: q ? `"${q}" 검색 결과` : "검색",
    description: q ? `"${q}"에 대한 기술 스택 검색 결과` : "기술 스택 검색",
  }
}

async function fetchSearchResults(keyword: string): Promise<SearchResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"
  const encoded = encodeURIComponent(keyword)
  const res = await fetch(`${baseUrl}/api/tech/search?q=${encoded}`, {
    next: { revalidate: NOTION_REVALIDATE_SECONDS },
  })
  if (!res.ok) throw new Error(`검색 실패: ${res.status}`)
  return res.json() as Promise<SearchResponse>
}

// 데이터 패칭 + 그리드 렌더링 (Suspense 경계 안쪽)
async function SearchResults({ keyword }: { keyword: string }) {
  if (!keyword) {
    return (
      <TechGrid
        items={[]}
        emptyMessage="검색어를 입력하세요."
      />
    )
  }

  let data: SearchResponse
  try {
    data = await fetchSearchResults(keyword)
  } catch {
    data = { keyword, items: [], total: 0 }
  }

  const hasNoResult = data.items.length === 0

  return (
    <>
      <p className="mb-6 text-muted-foreground">
        {data.total}개의 기술 스택을 찾았습니다.
      </p>
      <TechGrid
        items={data.items}
        emptyMessage="검색 결과가 없습니다."
        emptySubMessage="다른 키워드로 검색하거나 카테고리를 탐색해보세요."
      />
      {hasNoResult && (
        <div className="mt-6 flex justify-center">
          <Button asChild variant="outline">
            <Link href="/">홈으로 이동</Link>
          </Button>
        </div>
      )}
    </>
  )
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q: keyword } = await searchParams
  const trimmedKeyword = keyword?.trim() ?? ""

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* 뒤로 가기 */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="size-4" />
            홈
          </Link>
        </Button>
      </div>

      {/* 검색 헤딩 */}
      <div className="mb-6">
        {trimmedKeyword ? (
          <h1 className="text-2xl font-bold tracking-tight">
            &ldquo;{trimmedKeyword}&rdquo; 검색 결과
          </h1>
        ) : (
          <h1 className="text-2xl font-bold tracking-tight">검색</h1>
        )}
      </div>

      {/* 재검색 입력창 */}
      <div className="mb-8 max-w-md">
        <Suspense>
          <SearchInput placeholder="다른 키워드로 검색..." />
        </Suspense>
      </div>

      {/* 검색 결과 (Suspense로 스켈레톤 표시) */}
      <Suspense fallback={<TechGridSkeleton />}>
        <SearchResults keyword={trimmedKeyword} />
      </Suspense>
    </div>
  )
}
