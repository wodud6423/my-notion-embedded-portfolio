import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function TechCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="mb-2 flex items-start justify-between gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="mt-1 h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-10 rounded-md" />
          ))}
        </div>
        <Skeleton className="mt-3 h-3 w-24" />
      </CardContent>
    </Card>
  )
}

// 그리드 전체 스켈레톤 (6개 = 3열×2행)
export function TechGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <TechCardSkeleton key={i} />
      ))}
    </div>
  )
}
