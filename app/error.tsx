'use client'

import Link from "next/link"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

// 런타임 오류 발생 시 표시 (클라이언트 컴포넌트 필수)
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[ErrorPage] 오류 발생:", error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-2 text-4xl font-bold">오류가 발생했습니다</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        데이터를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset} variant="outline">
          다시 시도
        </Button>
        <Button asChild>
          <Link href="/">홈으로 이동</Link>
        </Button>
      </div>
    </div>
  )
}
