import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { NotionBlockRenderer } from "@/components/tech/notion-renderer/NotionBlockRenderer"
import { DIFFICULTY_LABELS, NOTION_REVALIDATE_SECONDS } from "@/lib/constants"
import type { TechStackDetail } from "@/types"

// ISR 캐싱 설정 (60초 재검증)
export const revalidate = 60

interface PageProps {
  params: Promise<{ id: string }>
}

// 동적 메타데이터 생성
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  try {
    const data = await fetchTechDetail(id)
    return {
      title: data.title,
      description: data.summary,
    }
  } catch {
    return { title: "기술 상세" }
  }
}

// 기술 상세 데이터 서버에서 조회
async function fetchTechDetail(id: string): Promise<TechStackDetail> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"
  const res = await fetch(`${baseUrl}/api/tech/${id}`, {
    next: { revalidate: NOTION_REVALIDATE_SECONDS },
  })
  if (!res.ok) {
    throw new Error(`기술 상세 조회 실패: ${res.status}`)
  }
  return res.json() as Promise<TechStackDetail>
}

// 중요도 별 문자열 변환
function renderImportance(importance: number): string {
  const clamped = Math.min(5, Math.max(1, importance))
  return "★".repeat(clamped) + "☆".repeat(5 - clamped)
}

export default async function TechDetailPage({ params }: PageProps) {
  const { id } = await params

  let data: TechStackDetail
  try {
    data = await fetchTechDetail(id)
  } catch {
    notFound()
  }

  const hasConceptSection = data.content.concept.length > 0
  const hasImplementationSection = data.content.implementation.length > 0
  const hasTroubleshootingSection = data.content.troubleshooting.length > 0

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {/* 뒤로 가기 */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/category/${data.category}`}>
            <ArrowLeft className="size-4" />
            {data.category}
          </Link>
        </Button>
      </div>

      {/* 기술 헤딩 및 메타 정보 */}
      <header className="mb-8">
        <h1 className="mb-3 text-3xl font-bold tracking-tight">{data.title}</h1>
        <p className="mb-4 text-lg text-muted-foreground">{data.summary}</p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{data.category}</Badge>
          <Badge variant="secondary">{DIFFICULTY_LABELS[data.difficulty]}</Badge>
          <span className="text-sm text-muted-foreground" aria-label={`중요도 ${data.importance}점`}>
            {renderImportance(data.importance)}
          </span>
        </div>
        {data.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {data.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* 본문 섹션 */}
      <div className="space-y-10">
        {/* 개념 섹션 */}
        {hasConceptSection && (
          <section>
            <h2 className="mb-4 text-xl font-semibold">개념 (Concept)</h2>
            <NotionBlockRenderer blocks={data.content.concept} />
          </section>
        )}

        {/* 구현 경험 섹션 */}
        {hasImplementationSection && (
          <section>
            <h2 className="mb-4 text-xl font-semibold">구현 경험 (Implementation)</h2>
            <NotionBlockRenderer blocks={data.content.implementation} />
          </section>
        )}

        {/* 트러블슈팅 섹션 */}
        {hasTroubleshootingSection && (
          <section>
            <h2 className="mb-4 text-xl font-semibold">트러블슈팅 (Troubleshooting)</h2>
            <NotionBlockRenderer blocks={data.content.troubleshooting} />
          </section>
        )}

        {/* 섹션 없을 경우 안내 */}
        {!hasConceptSection && !hasImplementationSection && !hasTroubleshootingSection && (
          <div className="py-12 text-center text-muted-foreground">
            <p>아직 작성된 내용이 없습니다.</p>
            <p className="mt-1 text-sm">Notion 페이지에 개념, 구현 경험, 트러블슈팅 섹션을 추가하세요.</p>
          </div>
        )}
      </div>
    </div>
  )
}
