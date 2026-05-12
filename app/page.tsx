import Link from "next/link"
import { Suspense } from "react"
import { ArrowRight, Cpu, Layers, Settings, BookOpen } from "lucide-react"
import type { PageObjectResponse } from "@notionhq/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HomeTechList } from "@/components/tech/home-tech-list"
import { FilterBar } from "@/components/tech/filter-bar"
import { TechGridSkeleton } from "@/components/tech/tech-card-skeleton"
import { TECH_CATEGORIES } from "@/lib/constants"
import { getNotionClient, getNotionDatabaseId } from "@/lib/notion"
import { mapPageToTechStack } from "@/lib/tech-mapper"
import type { TechListResponse } from "@/types"

export const revalidate = 60

// 카테고리별 설명 및 아이콘 매핑
const categoryMeta: Record<string, { icon: React.ComponentType<{ className?: string }>; description: string }> = {
  Kernel: {
    icon: Cpu,
    description: "Linux 커널 아키텍처, 프로세스 스케줄링, 메모리 관리",
  },
  Driver: {
    icon: Settings,
    description: "GPIO, UART, I2C, SPI 등 디바이스 드라이버 개발",
  },
  RTOS: {
    icon: Layers,
    description: "FreeRTOS, Zephyr 기반 실시간 운영체제 응용",
  },
  Yocto: {
    icon: BookOpen,
    description: "Yocto Project 기반 임베디드 리눅스 빌드 시스템",
  },
}

// 포트폴리오 기술 스택 배지 목록
const techBadges = [
  "Linux Kernel",
  "Device Driver",
  "FreeRTOS",
  "Yocto",
  "C/C++",
  "ARM",
  "I2C",
  "SPI",
  "UART",
  "DMA",
]

async function fetchInitialTechList(): Promise<TechListResponse> {
  const notion = getNotionClient()
  const databaseId = getNotionDatabaseId()
  const response = await notion.dataSources.query({
    data_source_id: databaseId,
    sorts: [{ property: "Importance", direction: "descending" }],
  })
  const items = response.results
    .filter((item): item is PageObjectResponse => item.object === "page")
    .map(mapPageToTechStack)
  return { items, total: items.length }
}

export default async function HomePage() {
  let initialItems: TechListResponse["items"] = []
  try {
    const data = await fetchInitialTechList()
    initialItems = data.items
  } catch {
    // Notion API 오류 시 빈 목록으로 폴백
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      {/* 히어로 섹션 */}
      <section className="mb-20 text-center">
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {techBadges.map((badge) => (
            <Badge key={badge} variant="secondary">{badge}</Badge>
          ))}
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          임베디드 기술 포트폴리오
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
          Notion에 정리된 임베디드 시스템 기술 스택과 구현 경험을 확인하세요.
          개념 설명부터 트러블슈팅까지 실무 역량을 한 곳에서 제공합니다.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/category/Kernel">
              기술 스택 보기
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* 카테고리 섹션 */}
      <section className="mb-16">
        <h2 className="mb-8 text-center text-2xl font-semibold">카테고리별 기술 스택</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {TECH_CATEGORIES.filter((cat) => cat !== 'Other').map((category) => {
            const meta = categoryMeta[category]
            if (!meta) return null
            const Icon = meta.icon
            return (
              <Link
                key={category}
                href={`/category/${category}`}
                className="group rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{category}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{meta.description}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  자세히 보기
                  <ArrowRight className="size-3" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 전체 기술 스택 섹션 */}
      <section>
        <h2 className="mb-6 text-center text-2xl font-semibold">전체 기술 스택</h2>
        <div className="mb-6">
          <FilterBar />
        </div>
        <Suspense fallback={<TechGridSkeleton />}>
          <HomeTechList initialItems={initialItems} />
        </Suspense>
      </section>
    </div>
  )
}
