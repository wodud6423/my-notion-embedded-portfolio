// 테마 타입
export type Theme = 'light' | 'dark' | 'system'

// 네비게이션
export interface NavItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  disabled?: boolean
  external?: boolean
}

// 사이트 설정
export interface SiteConfig {
  name: string
  description: string
  navItems: readonly NavItem[]
}

// API 응답 공통 형식
export interface ApiResponse<T> {
  data: T
  error: string | null
  status: number
}

// 페이지네이션
export interface PaginationState {
  page: number
  pageSize: number
  total: number
}

// 공통 컴포넌트 Props
export interface BaseProps {
  className?: string
  children?: React.ReactNode
}

// Toast
export interface ToastOptions {
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success'
  duration?: number
}

export interface ToastItem extends ToastOptions {
  id: string
}

// 기술 카테고리 타입 (Notion 데이터베이스 Category 프로퍼티 값)
export type TechCategory = 'Kernel' | 'Driver' | 'RTOS' | 'Yocto' | 'Other'

// 기술 난이도 타입 (Notion 데이터베이스 Difficulty 프로퍼티 값)
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'

// 기술 스택 목록 아이템 (Notion 데이터베이스 행)
export interface TechStack {
  id: string          // Notion Page ID
  title: string       // 기술 이름
  category: TechCategory
  tags: string[]      // 태그 목록
  summary: string     // 한 줄 요약
  difficulty: Difficulty
  importance: number  // 중요도 (1~5)
  createdAt: string   // 생성일 (ISO 8601)
}

// 기술 상세 (목록 아이템 + Notion 본문 블록)
export interface TechStackDetail extends TechStack {
  content: {
    concept: NotionBlock[]
    implementation: NotionBlock[]
    troubleshooting: NotionBlock[]
  }
}

// Notion 블록 기본 구조 (렌더링 가능한 형태)
export interface NotionBlock {
  id: string
  type: string
  content: Record<string, unknown>
}

// 기술 목록 API 응답
export interface TechListResponse {
  items: TechStack[]
  total: number
}

// 검색 API 응답
export interface SearchResponse {
  keyword: string
  items: TechStack[]
  total: number
}

// 필터 상태 (Zustand 스토어에서 사용)
export interface FilterState {
  category: TechCategory | null
  tags: string[]
  difficulty: Difficulty | null
  searchKeyword: string
}
