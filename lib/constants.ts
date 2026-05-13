// 사이트 전역 설정
export const SITE_CONFIG = {
  name: 'Embedded Portfolio',
  description: '임베디드 시스템 기술 역량을 전달하는 포트폴리오',
  // 헤더 네비게이션 메뉴 항목
  navItems: [
    { label: 'Home', href: '/' },
    { label: 'Kernel', href: '/category/Kernel' },
    { label: 'Driver', href: '/category/Driver' },
    { label: 'RTOS', href: '/category/RTOS' },
    { label: 'Yocto', href: '/category/Yocto' },
    { label: 'Resume', href: '/resume' },
  ],
} as const

// 테마 로컬스토리지 키
export const THEME_STORAGE_KEY = 'theme'

// 토스트 기본 설정
export const TOAST_DURATION = 4000
export const MAX_TOAST_COUNT = 5

// Notion 기술 카테고리 목록
export const TECH_CATEGORIES = ['Kernel', 'Driver', 'RTOS', 'Yocto', 'Other'] as const

// 기술 난이도 레이블
export const DIFFICULTY_LABELS = {
  Beginner: '초급',
  Intermediate: '중급',
  Advanced: '고급',
} as const

// Notion API ISR 재검증 주기 (초)
export const NOTION_REVALIDATE_SECONDS = 60

// 소셜 링크
export const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com', external: true },
] as const
