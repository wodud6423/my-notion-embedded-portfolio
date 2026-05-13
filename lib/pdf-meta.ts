import { put, list } from "@vercel/blob"
import type { PdfFileMeta, PdfMetaFile } from "@/types"

const META_BLOB_PATHNAME = "pdf-meta.json"

const DEFAULT_META: PdfMetaFile = { resume: null, portfolio: null }

export async function readPdfMeta(): Promise<PdfMetaFile> {
  try {
    const { blobs } = await list({ prefix: META_BLOB_PATHNAME })
    if (blobs.length === 0) return DEFAULT_META

    const blob = blobs.find((b) => b.pathname === META_BLOB_PATHNAME)
    if (!blob) return DEFAULT_META

    const response = await fetch(blob.url, { cache: "no-store" })
    if (!response.ok) return DEFAULT_META

    const data = (await response.json()) as PdfMetaFile
    return data
  } catch {
    return DEFAULT_META
  }
}

export async function writePdfMeta(data: PdfMetaFile): Promise<void> {
  const json = JSON.stringify(data, null, 2)
  await put(META_BLOB_PATHNAME, json, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  })
}

export async function updatePdfMeta(
  type: "resume" | "portfolio",
  meta: PdfFileMeta
): Promise<void> {
  const current = await readPdfMeta()
  await writePdfMeta({ ...current, [type]: meta })
}

export async function getPdfUrl(type: "resume" | "portfolio"): Promise<string | null> {
  const meta = await readPdfMeta()
  return meta[type]?.url ?? null
}
