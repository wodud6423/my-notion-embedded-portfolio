import { NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { updatePdfMeta } from "@/lib/pdf-meta"
import type { PdfFileMeta } from "@/types"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const type = formData.get("type") as "resume" | "portfolio" | null
    const fileName = formData.get("fileName") as string | null

    if (!file || !type || !fileName) {
      return NextResponse.json(
        { error: "file, type, fileName은 필수입니다." },
        { status: 400 }
      )
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "PDF 파일만 업로드 가능합니다." }, { status: 400 })
    }

    const pathname = `pdf/${type}-${Date.now()}.pdf`
    const blob = await put(pathname, file, {
      access: "public",
      contentType: "application/pdf",
    })

    const meta: PdfFileMeta = {
      type,
      url: blob.url,
      uploadedAt: new Date().toISOString(),
      fileName,
    }

    await updatePdfMeta(type, meta)

    return NextResponse.json({ success: true, url: blob.url })
  } catch (error) {
    console.error("[POST /api/admin/upload-pdf] 오류:", error)
    return NextResponse.json(
      { error: "PDF 업로드 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}
