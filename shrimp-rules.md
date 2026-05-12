# Development Guidelines

## Project Overview

- **목적**: Notion CMS 기반 임베디드 시스템 기술 포트폴리오
- **런타임**: Next.js `16.2.4` (App Router) + React `19.2.4`
- **CMS**: `@notionhq/client` v5 — 서버 전용, 클라이언트 직접 호출 절대 금지
- **배포**: Vercel (ISR 캐싱 적용)

---

## Phase 개발 순서 및 의존성

**반드시 아래 순서대로 구현한다. 선행 Phase가 완료되지 않으면 다음 Phase 진행 금지.**

```
Phase 1 (골격) → Phase 2 (공통 모듈) → Phase 3 (핵심 기능) → Phase 4 (추가 기능) → Phase 5 (최적화/배포)
```

### Phase별 상태 및 구현 대상

| Phase | 상태 | 핵심 구현 대상 |
|-------|------|--------------|
| 1 골격 | **완료** | `app/layout.tsx`, `app/globals.css`, `app/error.tsx`, `app/not-found.tsx`, `next.config.ts` |
| 2 공통 모듈 | **완료** | `lib/*`, `types/index.ts`, `hooks/*`, `store/filter-store.ts`, `components/layout/*`, `components/ui/*` |
| 3 핵심 기능 | **진행중** | `app/page.tsx`(Notion 연동), `components/tech/home-tech-list.tsx`, `components/tech/notion-renderer/*`, `app/tech/[id]/page.tsx`(렌더러 연결) / **완료**: `components/tech/tech-grid.tsx`, `app/category/[category]/page.tsx`(TechGrid 적용), `app/search/page.tsx`(TechGrid 교체) |
| 4 추가 기능 | **진행중** | `components/tech/filter-bar.tsx`, `components/layout/search-input.tsx`, `app/search/page.tsx`(TechGrid 교체) |
| 5 최적화/배포 | **미시작** | `components/tech/tech-card-skeleton.tsx`, Suspense 적용, ISR 전환, Vercel 배포 |

### Phase 간 재사용 관계

- Phase 3 `TechCard`·`TechGrid` → Phase 4 FilterBar·SearchPage에서 그대로 재사용
- Phase 4 `FilterBar`는 Phase 3 `TechGrid` 완성 이후에만 구현 시작
- Phase 5 스켈레톤 UI는 Phase 3~4 컴포넌트 구조 확정 이후 적용

---

## Project Architecture

### 디렉토리 역할

| 경로 | 역할 | 상태 |
|------|------|------|
| `app/api/tech/` | `GET /api/tech` (목록·필터) | 완료 |
| `app/api/tech/[id]/` | `GET /api/tech/[id]` (상세) | 완료 |
| `app/api/tech/search/` | `GET /api/tech/search?q=` (검색) | 완료 |
| `app/category/[category]/` | 카테고리별 기술 목록 페이지 | 완료 |
| `app/tech/[id]/` | 기술 상세 페이지 | 플레이스홀더 |
| `app/search/` | 검색 결과 페이지 | TechGrid 교체 완료 |
| `app/page.tsx` | 홈 페이지 | Notion 연동 필요 |
| `components/layout/` | 헤더, 푸터, 네비게이션, 테마 토글 | 완료 |
| `components/providers/` | ThemeProvider (자체 구현, next-themes 미사용) | 완료 |
| `components/tech/` | TechCard(완료), TechGrid(완료), FilterBar(미구현), NotionRenderer(미구현) | 일부 완료 |
| `components/ui/` | shadcn/ui 컴포넌트 — **직접 수정 금지** | 완료 |
| `lib/notion.ts` | Notion 클라이언트 싱글턴 + 환경변수 검증 | 완료 |
| `lib/tech-mapper.ts` | `PageObjectResponse` → `TechStack` 변환 | 완료 |
| `lib/block-parser.ts` | Notion 블록 → 섹션 분리 | 완료 |
| `lib/constants.ts` | 사이트 설정, 카테고리, 난이도 상수 | 완료 |
| `store/filter-store.ts` | Zustand v5 필터 상태 스토어 | 완료 |
| `types/index.ts` | 전체 TypeScript 타입 정의 | 완료 |
| `hooks/` | usehooks-ts re-export + 커스텀 use-toast | 완료 |

---

## Notion API 규칙

### API 버전: v5 (`@notionhq/client ^5.20.0`)

| 작업 | 올바른 메서드 | 금지 메서드 |
|------|-------------|------------|
| 데이터베이스 쿼리 | `notion.dataSources.query({ data_source_id })` | ❌ `notion.databases.query()` (v4, 동작 안 함) |
| 페이지 조회 | `notion.pages.retrieve({ page_id })` | — |
| 블록 조회 | `notion.blocks.children.list({ block_id })` | — |

### Notion 클라이언트 사용 패턴

```ts
// lib/notion.ts에서 가져와 사용 (직접 new Client() 금지)
import { getNotionClient, getNotionDatabaseId } from "@/lib/notion"

const notion = getNotionClient()       // 싱글턴, 환경변수 자동 검증
const databaseId = getNotionDatabaseId()
```

### Notion 데이터베이스 프로퍼티 이름 (대소문자 정확히 일치 필수)

| 프로퍼티명 | 타입 | 값 |
|-----------|------|---|
| `Title` | `title` | 기술 이름 |
| `Category` | `select` | `Kernel` \| `Driver` \| `RTOS` \| `Yocto` \| `Other` |
| `Tags` | `multi_select` | `GPIO`, `UART`, `I2C` 등 |
| `Summary` | `rich_text` | 한 줄 요약 |
| `Difficulty` | `select` | `Beginner` \| `Intermediate` \| `Advanced` |
| `Importance` | `number` | 1~5 |
| `Created` | `created_time` | 자동 생성 |

### 블록 섹션 분리 규칙 (`lib/block-parser.ts`)

- `splitBlocksBySection()` 함수를 반드시 재사용, 중복 구현 금지
- H2 헤딩 텍스트 기준 분리: `"개념"/"concept"` → `concept[]`, `"구현"/"implementation"` → `implementation[]`, `"트러블"/"troubleshoot"` → `troubleshooting[]`

### Notion 이미지 처리

- Notion 이미지는 Next.js `<Image>` 컴포넌트로 렌더링
- `next.config.ts`에 `*.notion.so`, `*.amazonaws.com` 허용 설정 완료 — 추가 hostname 필요 시 해당 파일만 수정

---

## ISR 캐싱 규칙

### Route Handler 현재 설정 (실제 코드 기준)

| 파일 | Phase 3~4 (현재) | Phase 5 (예정) |
|------|-----------------|---------------|
| `app/api/tech/route.ts` | `force-dynamic` (searchParams 사용) | `revalidate = 60`으로 교체 |
| `app/api/tech/[id]/route.ts` | `revalidate = 60` | 유지 |
| `app/api/tech/search/route.ts` | `force-dynamic` (searchParams 사용) | `revalidate = 60`으로 교체 |

- **Phase 5 이전에 `force-dynamic`을 임의로 교체 금지**

### 페이지 컴포넌트 설정

- 모든 페이지 파일 최상단에 `export const revalidate = 60` 선언
- fetch 옵션: `{ next: { revalidate: NOTION_REVALIDATE_SECONDS } }` 사용 (`NOTION_REVALIDATE_SECONDS` = `60`)

### 서버 컴포넌트 fetch 패턴 (일관성 유지)

```ts
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"
const res = await fetch(`${baseUrl}/api/tech/...`, {
  next: { revalidate: NOTION_REVALIDATE_SECONDS },
})
```

---

## 서버 / 클라이언트 컴포넌트 분리

### 서버 컴포넌트 (기본값, `'use client'` 없음)

- Notion API 호출 (`lib/notion.ts` 함수 호출)
- 초기 데이터 fetch (`/api/tech*` 엔드포인트)
- `generateMetadata`, `generateStaticParams`

### 클라이언트 컴포넌트 (파일 최상단 `'use client'` 필수)

- `useFilterStore()` Zustand 구독
- `useState`, `useEffect`, `useCallback` 사용
- 이벤트 핸들러 (onClick, onChange 등)
- `useTheme()` — `components/providers/theme-provider.tsx`에서 export (ThemeProvider 내부에서만 사용 가능)
- `useToast()` — `hooks/use-toast.ts`, globalThis 기반 커스텀 구현

### 위반 체크

- 서버 컴포넌트에서 `useState`, `useEffect` 사용 → 즉시 `'use client'` 추가 또는 컴포넌트 분리
- 클라이언트 컴포넌트에서 `getNotionClient()` 호출 → Route Handler로 이동

---

## Phase 3: 핵심 기능 구현 규칙

### 홈 페이지 컴포넌트 계층

```
app/page.tsx                           ← 서버 컴포넌트 (초기 fetch, 'use client' 없음)
  └── components/tech/home-tech-list.tsx  ← 클라이언트 컴포넌트 ('use client') [미구현]
                                            Zustand 구독, 필터 변경 시 API 재요청
        └── components/tech/tech-grid.tsx  ← 순수 렌더링 컴포넌트 (TechCard 배열 → 그리드) [완료]
```

- `app/page.tsx`: `/api/tech` 초기 fetch → `HomeTechList`에 `initialItems` props 전달
- `HomeTechList`: `useFilterStore()` 구독 → 필터 변경 시 `/api/tech?category=X&tags=Y&difficulty=Z` 재요청
- `TechGrid`: **완료** — `{ items: TechStack[], emptyMessage?, emptySubMessage?, className? }` props. 카테고리·검색 페이지에서 이미 사용 중. 인라인 그리드 패턴 대신 반드시 TechGrid 재사용

### app/tech/[id]/page.tsx 수정

- 현재 플레이스홀더(`{data.content.concept.length}개의 블록`) 전체 제거
- `NotionBlockRenderer` 컴포넌트를 `concept`, `implementation`, `troubleshooting` 각각에 연결

### NotionBlockRenderer 컴포넌트 구조

경로: `components/tech/notion-renderer/`

| 파일 | 담당 블록 타입 |
|------|--------------|
| `NotionBlockRenderer.tsx` | `type` 분기 진입점 — 하위 컴포넌트로 위임 |
| `ParagraphBlock.tsx` | `paragraph` |
| `HeadingBlock.tsx` | `heading_1`, `heading_2`, `heading_3` |
| `BulletedListBlock.tsx` | `bulleted_list_item` |
| `NumberedListBlock.tsx` | `numbered_list_item` |
| `CodeBlock.tsx` | `code` — shiki 서버 사이드 하이라이팅, **`'use client'` 절대 금지** |
| `QuoteBlock.tsx` | `quote` |
| `CalloutBlock.tsx` | `callout` — shadcn/ui `Alert` 활용 |
| `DividerBlock.tsx` | `divider` |
| `UnsupportedBlock.tsx` | 나머지 모든 타입 — 폴백, 페이지 렌더링 중단 방지 |

### Rich Text 처리 규칙

- `annotations.bold` → `<strong>`
- `annotations.italic` → `<em>`
- `annotations.code` → `<code>`
- `annotations.strikethrough` → `<s>`
- `NotionBlock.content`에서 데이터 추출 시 **타입 가드 필수** (`Record<string, unknown>`)

### shiki 사용 규칙

- `shiki` 패키지 설치 완료 (`package.json` 반영) — CodeBlock.tsx 구현 시 바로 사용 가능
- `CodeBlock.tsx`는 서버 컴포넌트 전용 (`'use client'` 절대 금지)
- 지원 언어만 import: `c`, `cpp`, `shell`, `python`, `makefile` (번들 크기 최소화)
- `codeToHtml()` 함수 사용, theme: `github-dark`

---

## Phase 4: 추가 기능 구현 규칙

### FilterBar (`components/tech/filter-bar.tsx`)

- **클라이언트 컴포넌트** (`'use client'` 필수)
- `useFilterStore()` 액션 연결: `setCategory`, `toggleTag`, `setDifficulty`, `resetFilters`
- FilterBar 자체는 fetch 하지 않음 — 상태 변경은 `HomeTechList`가 감지하여 재요청
- 카테고리 탭: shadcn/ui `Tabs` (전체 / Kernel / Driver / RTOS / Yocto)
- 태그: 멀티 선택 토글 버튼 (`useFilterStore().toggleTag`)
- 난이도: shadcn/ui `Select` (`useFilterStore().setDifficulty`)

### SearchInput (`components/layout/search-input.tsx`)

- **클라이언트 컴포넌트** (`'use client'` 필수)
- `useDebounce` 사용법: `usehooks-ts`의 `useDebounceValue` 튜플 반환 — `const [debouncedValue] = useDebounce(value, 300)`
- 엔터/버튼 클릭 → `router.push('/search?q=keyword')`
- **Zustand 스토어 경유 금지** — 검색은 URL `searchParams` 기반

### app/search/page.tsx 수정

- 현재 카드 그리드 부분을 Phase 3에서 완성된 `TechGrid` 컴포넌트로 교체
- `searchParams.q` 추출 → `/api/tech/search?q=` 호출 로직은 유지

---

## 타입 정의 규칙

### `any` 타입 절대 금지

- Notion 블록 `content` 필드: `Record<string, unknown>` + 타입 가드 패턴
- `eslint-disable @typescript-eslint/no-explicit-any` 주석 사용 금지

### 타입 정의 위치

- 모든 인터페이스/타입 추가: `types/index.ts`만 수정, 별도 파일 생성 금지
- Notion 원본 응답: `@notionhq/client` 타입 활용 (`PageObjectResponse`, `BlockObjectResponse`)

### 주요 타입 참조 (`types/index.ts`)

```ts
TechStack        // Notion 데이터베이스 행 → 기술 목록 아이템
TechStackDetail  // TechStack + content { concept, implementation, troubleshooting }
NotionBlock      // { id: string, type: string, content: Record<string, unknown> }
TechCategory     // 'Kernel' | 'Driver' | 'RTOS' | 'Yocto' | 'Other'
Difficulty       // 'Beginner' | 'Intermediate' | 'Advanced'
TechListResponse // { items: TechStack[], total: number }
SearchResponse   // { keyword: string, items: TechStack[], total: number }
FilterState      // Zustand 스토어 상태 타입
```

---

## 상태 관리 규칙 (Zustand v5)

- 필터 스토어: `store/filter-store.ts`의 `useFilterStore` 사용
- 사용 가능 액션: `setCategory`, `toggleTag`, `clearTags`, `setDifficulty`, `setSearchKeyword`, `resetFilters`
- **검색은 URL `searchParams` 기반** — `setSearchKeyword`는 홈 필터 전용
- 추가 스토어 필요 시 `store/` 디렉토리에만 생성
- `store/filter-store.ts` 파일 최상단에 `'use client'` 있음 — 이 패턴 유지

---

## 스타일링 규칙

### Tailwind CSS v4 (postcss 방식)

- `tailwind.config.*` 파일 없음 — **생성 금지**
- 색상: `app/globals.css`의 oklch CSS 커스텀 속성 사용 (예: `bg-background`, `text-muted-foreground`)
- oklch 값 인라인 직접 사용 금지
- `@import "tailwindcss"` + `@import "tw-animate-css"` + `@import "shadcn/tailwind.css"` 구조 유지

### 반응형 그리드 패턴 (전 페이지 통일)

```tsx
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
```

모바일 1열 / 태블릿 2열 / 데스크탑 3열 — 홈·카테고리·검색 결과 동일 패턴

### 최대 너비 기준

- 콘텐츠 래퍼: `mx-auto max-w-5xl px-4` — 기존 페이지 패턴 유지

### shadcn/ui

- 컴포넌트 추가: `npx shadcn@latest add <component>`
- `components/ui/` 파일 직접 수정 금지
- 스타일: `radix-nova` (`components.json` 고정)
- 아이콘: `lucide-react` (`lucide-react ^1.14.0`)
- 이미 설치된 컴포넌트: `alert`, `badge`, `button`, `card`, `checkbox`, `dialog`, `input`, `label`, `radio-group`, `select`, `separator`, `switch`, `tabs`, `toast`, `toaster`, `tooltip`

---

## hooks 사용 규칙

| 훅 | import 경로 | 실제 구현 |
|----|-----------|---------|
| `useDebounce` | `@/hooks/use-debounce` | `usehooks-ts`의 `useDebounceValue` re-export — **튜플 반환** `[debouncedValue, setValue]` |
| `useLocalStorage` | `@/hooks/use-local-storage` | `usehooks-ts` re-export |
| `useMediaQuery` | `@/hooks/use-media-query` | `usehooks-ts` re-export |
| `useToast` | `@/hooks/use-toast` | globalThis 기반 커스텀 구현, 클라이언트 전용 |
| `useTheme` | `@/components/providers/theme-provider` | ThemeProvider 자체 구현, **ThemeProvider 내부에서만 사용 가능** |

- `usehooks-ts`를 직접 import 금지 — 반드시 `@/hooks/*` 경로 사용
- `next-themes` 패키지 설치 금지 (ThemeProvider 자체 구현 중)

---

## 파일 동시 수정 규칙

| 수정 대상 | 함께 수정해야 할 파일 |
|----------|---------------------|
| 새 카테고리 추가 | `lib/constants.ts` → `TECH_CATEGORIES` + `types/index.ts` → `TechCategory` |
| 새 난이도 추가 | `lib/constants.ts` → `DIFFICULTY_LABELS` + `types/index.ts` → `Difficulty` |
| 헤더 네비게이션 변경 | `lib/constants.ts` → `SITE_CONFIG.navItems` |
| 소셜 링크 변경 | `lib/constants.ts` → `SOCIAL_LINKS` |
| 새 API Route 추가 | Route Handler + `export const dynamic` 또는 `revalidate` 반드시 선언 |
| Notion 프로퍼티 이름 변경 | `lib/tech-mapper.ts`의 해당 `extractXxx()` 함수 수정 |
| 새 타입 추가 | `types/index.ts`만 수정 |
| Notion 이미지 허용 hostname 추가 | `next.config.ts` → `images.remotePatterns` |

---

## 환경변수

| 변수명 | 용도 | 노출 범위 |
|--------|------|---------|
| `NOTION_TOKEN` | Notion Integration Token | 서버 전용 (`process.env.NOTION_TOKEN`) |
| `NOTION_DATABASE_ID` | 기술 스택 데이터베이스 ID | 서버 전용 |
| `NEXT_PUBLIC_BASE_URL` | 배포 도메인 | 클라이언트 노출 가능 |

- `NOTION_TOKEN`, `NOTION_DATABASE_ID` 클라이언트 컴포넌트 직접 참조 금지
- `NEXT_PUBLIC_BASE_URL` 미설정 기본값: `"http://localhost:3000"`

---

## AI 결정 보류 항목

아래 항목은 AI가 임의 결정 금지 — **사용자 확인 후 진행**

| 항목 | 현재 상태 | 결정 필요 시점 |
|------|----------|--------------|
| 홈 페이지 히어로 섹션 유지 여부 | 유지 중 (정적 히어로 + 카테고리 카드 공존) | Phase 3 `app/page.tsx` 수정 전 |
| 태그 필터 데이터 소스 | 미결 정 | Phase 4 `filter-bar.tsx` 구현 전 |

---

## 경로 별칭

- `@/*` → 프로젝트 루트 (`tsconfig.json` `paths` 설정)
- 상대 경로(`../../`) 사용 금지, 항상 `@/` 사용

---

## 금지 사항

- `any` 타입 사용 (eslint-disable 우회 포함)
- 클라이언트 컴포넌트에서 Notion API 직접 호출
- `notion.databases.query()` 사용 (v4 API, v5에서 제거됨)
- `components/ui/` 파일 직접 수정
- 상대 경로 import (`../../` 대신 `@/`)
- `tailwind.config.*` 파일 생성
- `next-themes` 패키지 설치 (ThemeProvider 자체 구현 중)
- `usehooks-ts` 직접 import (`@/hooks/*` 경유 필수)
- `types/index.ts` 외 별도 타입 파일 생성
- ISR 설정 없는 Route Handler 추가 (`dynamic` 또는 `revalidate` 반드시 선언)
- 서버 컴포넌트에서 `useState`, `useEffect` 사용
- Phase 5 이전에 `force-dynamic` → `revalidate` 임의 교체
