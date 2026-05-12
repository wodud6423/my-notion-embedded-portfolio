import Link from "next/link"
import { Button } from "@/components/ui/button"

// 존재하지 않는 페이지 접근 시 표시
export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-2 text-6xl font-bold text-muted-foreground">404</h1>
      <h2 className="mb-4 text-2xl font-semibold">페이지를 찾을 수 없습니다</h2>
      <p className="mb-8 max-w-md text-muted-foreground">
        요청하신 페이지가 존재하지 않거나 삭제되었습니다.
      </p>
      <Button asChild>
        <Link href="/">홈으로 이동</Link>
      </Button>
    </div>
  )
}
