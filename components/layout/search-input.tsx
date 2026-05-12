'use client'

import { useState, useEffect, type FormEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDebounce } from "@/hooks/use-debounce"

interface SearchInputProps {
  placeholder?: string
  className?: string
}

export function SearchInput({ placeholder = "기술 검색...", className }: SearchInputProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // searchParams에서 초기값 읽기 (컴포넌트 마운트 시 1회)
  const [value, setValue] = useState(() => searchParams.get("q") ?? "")
  const [debouncedValue] = useDebounce(value, 300)

  // 디바운스된 값으로 검색 페이지로 이동 (value 변경 시에만)
  useEffect(() => {
    const trimmed = debouncedValue.trim()
    // 현재 URL의 q와 동일하면 라우팅 생략
    const currentQ = searchParams.get("q") ?? ""
    if (trimmed && trimmed !== currentQ) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`)
    }
  }, [debouncedValue]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`)
    }
  }

  function handleClear() {
    setValue("")
    router.push("/")
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 size-4 text-muted-foreground" />
        <Input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="pl-9 pr-9"
          aria-label="기술 검색"
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 size-7"
            onClick={handleClear}
            aria-label="검색 초기화"
          >
            <X className="size-3.5" />
          </Button>
        )}
      </div>
    </form>
  )
}
