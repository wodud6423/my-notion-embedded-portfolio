"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { AdminAnalyzeResponse } from "@/types"

export function AnalyzeButton() {
  const router = useRouter()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AdminAnalyzeResponse | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  async function handleAnalyze() {
    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/admin/analyze", { method: "POST" })
      const data = (await response.json()) as AdminAnalyzeResponse
      setResult(data)
      setDialogOpen(true)
      if (data.success) {
        router.refresh()
      }
    } catch {
      setResult({
        success: false,
        updatedAt: new Date().toISOString(),
        updatedSummary: "",
        itemCount: 0,
        error: "네트워크 오류가 발생했습니다.",
      })
      setDialogOpen(true)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <>
      <Button onClick={handleAnalyze} disabled={isAnalyzing} className="gap-2">
        {isAnalyzing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            분석 중...
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            Notion 분석 시작
          </>
        )}
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {result?.success ? "분석 완료" : "분석 실패"}
            </DialogTitle>
            <DialogDescription>
              {result?.success
                ? result.updatedSummary
                : result?.error ?? "알 수 없는 오류가 발생했습니다."}
            </DialogDescription>
          </DialogHeader>
          {result?.success && (
            <div className="text-sm text-muted-foreground space-y-1">
              <p>등록된 기술 스택: <span className="font-medium text-foreground">{result.itemCount}개</span></p>
              <p>업데이트 시각: <span className="font-medium text-foreground">{new Date(result.updatedAt).toLocaleString("ko-KR")}</span></p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
