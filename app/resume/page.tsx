import { readPdfMeta } from "@/lib/pdf-meta"
import { Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

const PDF_INFO = {
  resume: {
    title: "이력서",
    description: "임베디드 시스템 개발자 이력서 (PDF)",
  },
  portfolio: {
    title: "기술 포트폴리오",
    description: "보유 기술 스택 및 프로젝트 상세 포트폴리오 (PDF)",
  },
} as const

export default async function ResumePage() {
  const pdfMeta = await readPdfMeta()

  const entries = (["resume", "portfolio"] as const).map((type) => ({
    type,
    ...PDF_INFO[type],
    meta: pdfMeta[type],
  }))

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">이력서 다운로드</h1>
        <p className="text-muted-foreground">
          임베디드 시스템 개발자의 이력서와 기술 포트폴리오를 다운로드합니다.
        </p>
      </div>

      <div className="space-y-4">
        {entries.map(({ type, title, description, meta }) => (
          <Card key={type}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" />
                {title}
              </CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              {meta ? (
                <div className="flex items-center justify-between gap-4">
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">{meta.fileName}</p>
                    <p>업로드: {new Date(meta.uploadedAt).toLocaleDateString("ko-KR")}</p>
                  </div>
                  <Button asChild className="gap-2 shrink-0">
                    <a href={meta.url} target="_blank" rel="noopener noreferrer" download>
                      <Download className="h-4 w-4" />
                      다운로드
                    </a>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm text-muted-foreground">준비 중입니다.</p>
                  <Button disabled className="gap-2 shrink-0">
                    <Download className="h-4 w-4" />
                    다운로드
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
