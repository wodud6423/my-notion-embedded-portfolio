import { readTechCache } from "@/lib/tech-cache"
import { readPdfMeta } from "@/lib/pdf-meta"
import { AnalyzeButton } from "@/components/admin/analyze-button"
import { TechTable } from "@/components/admin/tech-table"
import { PdfUploadCard } from "@/components/admin/pdf-upload-card"
import { Separator } from "@/components/ui/separator"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const [cache, pdfMeta] = await Promise.all([readTechCache(), readPdfMeta()])

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* 캐시 상태 */}
      <section>
        <h1 className="text-2xl font-bold mb-1">기술 스택 관리</h1>
        <div className="text-sm text-muted-foreground mb-6">
          {cache ? (
            <>
              마지막 분석:{" "}
              <span className="text-foreground font-medium">
                {new Date(cache.updatedAt).toLocaleString("ko-KR")}
              </span>{" "}
              · 기술 스택{" "}
              <span className="text-foreground font-medium">{cache.items.length}개</span>
            </>
          ) : (
            "아직 분석 기록이 없습니다."
          )}
        </div>
        <div className="flex items-center gap-3">
          <AnalyzeButton />
          <p className="text-xs text-muted-foreground">
            Notion 페이지 트리를 탐색하여 LLM이 기술 스택을 자동 분석합니다. 수 분 소요될 수 있습니다.
          </p>
        </div>
      </section>

      <Separator />

      {/* 기술 스택 테이블 */}
      <section>
        <h2 className="text-lg font-semibold mb-4">기술 스택 목록</h2>
        <TechTable items={cache?.items ?? []} />
      </section>

      <Separator />

      {/* PDF 파일 관리 */}
      <section>
        <h2 className="text-lg font-semibold mb-4">PDF 파일 관리</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PdfUploadCard type="resume" currentMeta={pdfMeta.resume} />
          <PdfUploadCard type="portfolio" currentMeta={pdfMeta.portfolio} />
        </div>
      </section>
    </div>
  )
}
