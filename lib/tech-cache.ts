import { put, list } from "@vercel/blob"
import type { CachedTechStack, TechCacheFile } from "@/types"

const CACHE_BLOB_PATHNAME = "tech-cache.json"

export async function readTechCache(): Promise<TechCacheFile | null> {
  try {
    const { blobs } = await list({ prefix: CACHE_BLOB_PATHNAME })
    if (blobs.length === 0) return null

    // pathname이 정확히 일치하는 blob 찾기
    const blob = blobs.find((b) => b.pathname === CACHE_BLOB_PATHNAME)
    if (!blob) return null

    const response = await fetch(blob.url, { cache: "no-store" })
    if (!response.ok) return null

    const data = (await response.json()) as TechCacheFile
    return data
  } catch {
    return null
  }
}

export async function writeTechCache(data: TechCacheFile): Promise<void> {
  const json = JSON.stringify(data, null, 2)
  await put(CACHE_BLOB_PATHNAME, json, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  })
}

export async function getTechCacheItems(): Promise<CachedTechStack[]> {
  const cache = await readTechCache()
  return cache?.items ?? []
}

export async function getTechCacheUpdatedAt(): Promise<string | null> {
  const cache = await readTechCache()
  return cache?.updatedAt ?? null
}
