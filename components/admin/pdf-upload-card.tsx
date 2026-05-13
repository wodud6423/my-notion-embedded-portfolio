"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Upload, Loader2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { PdfFileMeta } from "@/types"

interface PdfUploadCardProps {
  type: "resume" | "portfolio"
  currentMeta: PdfFileMeta | null
}

const TITLES = {
  resume: "이력서",
  portfolio: "기술 포트폴리오",
}

export function PdfUploadCard({ type, currentMeta }: PdfUploadCardProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== "application/pdf") {
      setUploadError("PDF 파일만 업로드 가능합니다.")
      return
    }

    setIsUploading(true)
    setUploadError(null)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", type)
    formData.append("fileName", file.name)

    try {
      const response = await fetch("/api/admin/upload-pdf", { method: "POST", body: formData })
      if (!response.ok) {
        const data = (await response.json()) as { error?: string }
        setUploadError(data.error ?? "업로드 실패")
      } else {
        router.refresh()
      }
    } catch {
      setUploadError("네트워크 오류가 발생했습니다.")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-4 w-4" />
          {TITLES[type]}
        </CardTitle>
        <CardDescription>
          {currentMeta ? (
            <>
              <span className="font-medium text-foreground">{currentMeta.fileName}</span>
              <br />
              업로드: {new Date(currentMeta.uploadedAt).toLocaleDateString("ko-KR")}
            </>
          ) : (
            "업로드된 파일이 없습니다."
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {currentMeta ? "교체" : "업로드"}
        </Button>
        {uploadError && (
          <p className="mt-2 text-xs text-destructive">{uploadError}</p>
        )}
      </CardContent>
    </Card>
  )
}
