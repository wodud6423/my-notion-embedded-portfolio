# Development Guidelines

## Project Overview

- **목적**: Notion 페이지 트리 기반 임베디드 시스템 기술 포트폴리오 (Next.js App Router)
- **런타임**: Next.js `16.2.4` (App Router) + React `19.2.4` + TypeScript strict
- **CMS**: Notion 페이지 트리 탐색 + Claude API LLM 분석 → Vercel Blob JSON 캐시 → 방문자 서빙
- **배포**: Vercel (ISR 60초 재검증, Vercel Blob 영구 저장)
- **버전**: v2.0 (Phase 1~9 전체 완료)

---

## Architecture — 데이터 흐름

### 관리자 분석 플로우 (캐시 쓰기)

```
POST /api/admin/analyze (JWT 인증 필수)
  → lib/notion-tree.ts: fetchBspSubPages() — BSP 키워드 Depth1 필터 + Depth2 수집
  → lib/notion-page-reader.ts: fetchPageBlocks() + extractTextFromBlocks() (최대 2000자)
  → lib/llm-analyzer.ts: analyzeAllPages() — claude-sonnet-4-6, 400ms delay
  → lib/tech-cache.ts: writeTechCache() — Vercel Blob "tech-cache.json"
```

### 방문자 접속 플로우 (캐시 읽기)

```
방문자 접속
  → lib/tech-cache.ts: getTechCacheItems() — Vercel Blob "tech-cache.json" 읽기
  → GET /api/tech, /api/tech/search — 메모리 필터링 (revalidate=60)
  → GET /api/tech/[id] — 메타(캐시) + 블록(Notion 실시간 조회) 혼합
```

### 경로 보호

```
proxy.ts: /admin/**, /api/admin/** → JWT 쿠키 검증 → 미인증 시 /admin/login 리디렉션
```

---

## Project Architecture — 디렉토리 역할

### lib/ 파일별 역할 및 사용 규칙

| 파일 | 역할 | 사용 위치 |
|------|------|----------|
| `lib/notion.ts` | Notion 클라이언트 싱글턴 + `getNotionMainPageId()` | 서버 전용 |
| `lib/notion-tree.ts` | BSP 페이지 트리 Depth1/2 탐색, `inferCategoryFromTitle()` | `/api/admin/analyze` |
| `lib/notion-page-reader.ts` | 페이지 블록 텍스트 추출 (최대 2000자) | `lib/llm-analyzer.ts` |
| `lib/llm-analyzer.ts` | Claude API 분석, `analyzeAllPages()`, `generateChangeSummary()` | `/api/admin/analyze` |
| `lib/tech-cache.ts` | Vercel Blob "tech-cache.json" 읽기/쓰기 | API Route, 페이지 서버 컴포넌트 |
| `lib/pdf-meta.ts` | Vercel Blob "pdf-meta.json" 읽기/쓰기 | `/admin`, `/resume`, `/api/admin/upload-pdf` |
| `lib/auth.ts` | JWT `signAdminToken()` / `verifyAdminToken()` (jose HS256, 24h) | `/api/admin/login`, `proxy.ts` |
| `lib/block-parser.ts` | Notion 블록 → `{concept, implementation, troubleshooting}` H2 기준 분리 | `/api/tech/[id]` |
| `lib/tech-mapper.ts` | Notion DB `PageObjectResponse` → `TechStack` 변환 (레거시, 현재 미사용) | — |
| `lib/constants.ts` | `SITE_CONFIG.navItems`, `TECH_CATEGORIES`, `DIFFICULTY_LABELS`, `NOTION_REVALIDATE_SECONDS` | 전역 |
| `lib/utils.ts` | `cn()` Tailwind 클래스 병합 | 전역 |

### app/ 라우팅

| 경로 | 접근 | 설명 |
|------|------|------|
| `/` | 공개 | 홈 (기술 카드 + 필터 + 차트 + 업데이트 날짜) |
| `/category/[category]` | 공개 | 카테고리별 기술 목록 |
| `/tech/[id]` | 공개 | 기술 상세 (Notion 블록 렌더링) |
| `/search` | 공개 | 검색 결과 |
| `/resume` | 공개 | PDF 다운로드 |
| `/admin/login` | 공개 | 관리자 로그인 |
| `/admin` | **JWT 필수** | 분석 트리거 + 기술 테이블 + PDF 관리 |
| `/api/tech` | 공개 | 캐시 기반 목록/필터 (revalidate=60) |
| `/api/tech/[id]` | 공개 | 캐시 메타 + Notion 실시간 블록 (revalidate=60) |
| `/api/tech/search` | 공개 | 캐시 기반 텍스트 검색 (revalidate=60) |
| `/api/admin/login` | 공개 | 비밀번호 → JWT 쿠키 발급 |
| `/api/admin/logout` | JWT | 쿠키 만료 |
| `/api/admin/analyze` | JWT | LLM 분석 트리거 (maxDuration=300) |
| `/api/admin/comment` | JWT | Notion 페이지 코멘트 전송 |
| `/api/admin/upload-pdf` | JWT | Vercel Blob PDF 업로드 |

### components/ 구조

| 디렉토리 | 내용 |
|---------|------|
| `components/ui/` | shadcn/ui — **직접 수정 금지** |
| `components/layout/` | Header, Footer, NavLinks, MobileMenu, ThemeToggle, SearchInput |
| `components/providers/` | ThemeProvider (자체 구현, next-themes 미사용) |
| `components/tech/` | TechCard, TechGrid, TechCardSkeleton, HomeTechList, FilterBar, notion-renderer/* |
| `components/admin/` | AnalyzeButton, TechTable, FeedbackDialog, PdfUploadCard |
| `components/charts/` | TechDistributionChart (recharts, 클라이언트 컴포넌트) |

---

## 환경변수 규칙

### 필수 환경변수 (v2.0 기준)

| 변수명 | 용도 | 노출 범위 |
|--------|------|---------|
| `NOTION_TOKEN` | Notion Integration Token | 서버 전용 |
| `NOTION_MAIN_PAGE_ID` | BSP 연구 메인 페이지 ID | 서버 전용 |
| `ADMIN_PASSWORD` | 관리자 비밀번호 | 서버 전용 |
| `JWT_SECRET` | JWT 서명 시크릿 (32자 이상) | 서버 전용 |
| `ANTHROPIC_API_KEY` | Claude API 키 | 서버 전용 |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob 읽기/쓰기 토큰 | 서버 전용 |
| `NEXT_PUBLIC_BASE_URL` | 배포 도메인 | 클라이언트 노출 가능 |

- **`NOTION_DATABASE_ID` 사용 금지** — v2.0에서 `NOTION_MAIN_PAGE_ID`로 완전 교체됨
- 서버 전용 변수는 클라이언트 컴포넌트에서 직접 참조 금지

---

## Notion API 규칙

- **클라이언트 싱글턴**: `lib/notion.ts`의 `getNotionClient()` 만 사용, 직접 `new Client()` 금지
- **메인 페이지 ID**: `getNotionMainPageId()` 사용 (`process.env.NOTION_MAIN_PAGE_ID`)
- **페이지 트리 탐색**: `lib/notion-tree.ts`의 `fetchBspSubPages()` 재사용, 중복 구현 금지
- **블록 텍스트 추출**: `lib/notion-page-reader.ts`의 `fetchPageBlocks()` + `extractTextFromBlocks()` 재사용
- **블록 섹션 분리**: `lib/block-parser.ts`의 `splitBlocksBySection()` 재사용
- **Notion API 호출 시 400ms delay** 적용 (공식 RPS 3 req/s 준수)
- `notion.databases.query()` 사용 금지 (v4 API, v5에서 동작 안 함)
- Notion API는 서버 컴포넌트 또는 Route Handler에서만 호출

---

## Vercel Blob 규칙

- **캐시 파일**: `lib/tech-cache.ts`의 `readTechCache()` / `writeTechCache()` / `getTechCacheItems()` 만 사용
- **PDF 메타**: `lib/pdf-meta.ts`의 `readPdfMeta()` / `writePdfMeta()` / `updatePdfMeta()` 만 사용
- `data/*.json` 로컬 파일 방식 절대 금지 (Vercel 서버리스 환경에서 파일 쓰기 불가)
- Blob pathname: `tech-cache.json`, `pdf-meta.json` — 고정값, 임의 변경 금지
- `addRandomSuffix: false` 옵션 필수 (같은 경로에 덮어쓰기 보장)
- Vercel Blob URL 이미지 사용 시 `next.config.ts`의 `images.remotePatterns`에 `*.public.blob.vercel-storage.com` 이미 등록됨

---

## 관리자 인증 규칙

- **JWT 라이브러리**: `jose` 사용 (`lib/auth.ts`) — Edge Runtime 호환, `jsonwebtoken` 사용 금지
- **경로 보호**: `proxy.ts` — `/admin/**`, `/api/admin/**` 매처, **`middleware.ts` 생성 금지**
- **쿠키 이름**: `admin-token` (HttpOnly, SameSite=Strict, 24시간)
- 관리자 API Route에서 JWT 검증은 `proxy.ts`가 담당 — Route Handler 내부에서 중복 검증 불필요
- `JWT_SECRET` 미설정 시 `getJwtSecret()` 에러 throw — 환경변수 등록 필수

---

## API Route 규칙

- 모든 Route Handler에 반드시 `export const revalidate = 60` 또는 `export const dynamic = "force-dynamic"` 선언
- 공개 API (`/api/tech/*`): `revalidate = 60` 사용
- 관리자 API (`/api/admin/*`): `dynamic = "force-dynamic"` 사용
- `/api/admin/analyze`: `maxDuration = 300` 추가 필수 (LLM 분석 타임아웃 대응)
- Route Handler에서 Vercel Blob 읽기 시 `getTechCacheItems()` 사용 — 직접 `list()` 호출 금지

---

## 서버 / 클라이언트 컴포넌트 분리

### 서버 컴포넌트 (기본값)

- Notion API 호출, Vercel Blob 읽기, JWT 검증
- `lib/*` 함수 직접 호출
- `generateMetadata`, `generateStaticParams`

### 클라이언트 컴포넌트 (`'use client'` 필수)

- `useFilterStore()` Zustand 구독
- `useState`, `useEffect`, `useCallback` 사용
- 이벤트 핸들러 (onClick, onChange 등)
- recharts 차트 컴포넌트 (`TechDistributionChart`)
- `useToast()` — `hooks/use-toast.ts`

---

## LLM 분석 규칙

- **모델**: `claude-sonnet-4-6` 고정 — 임의 변경 금지
- **분석 단위**: Depth 2 세부 주제 페이지 1개 = TechStack 1개
- **딜레이**: `analyzeAllPages()` 내부 400ms delay — 변경 금지
- **null 반환 조건**: 목차/인덱스/개요 페이지 → `analyzePage()` null 반환 → 캐시에서 제외
- `@anthropic-ai/sdk` 클라이언트는 `lib/llm-analyzer.ts` 내부에서만 생성

---

## 타입 정의 규칙

- **모든 타입**: `types/index.ts`만 수정, 별도 파일 생성 금지
- `any` 타입 절대 금지 — `Record<string, unknown>` + 타입 가드 사용
- `eslint-disable @typescript-eslint/no-explicit-any` 주석 금지
- 주요 타입: `TechStack`, `CachedTechStack`, `TechCacheFile`, `TechStackDetail`, `NotionBlock`, `TechCategory`, `Difficulty`, `PdfFileMeta`, `PdfMetaFile`, `AdminAnalyzeResponse`, `NotionPageMeta`

---

## 스타일링 규칙

- `tailwind.config.*` 파일 생성 금지 (Tailwind v4 postcss 방식)
- `app/globals.css`의 oklch CSS 커스텀 속성 사용 — oklch 값 인라인 직접 사용 금지
- shadcn/ui 컴포넌트 추가: `npx shadcn@latest add <component>`
- `components/ui/` 파일 직접 수정 금지
- 반응형 그리드: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` 패턴 통일
- 콘텐츠 래퍼: `mx-auto max-w-5xl px-4` 패턴 통일

---

## 동시 수정 규칙

| 수정 대상 | 함께 수정해야 할 파일 |
|----------|---------------------|
| 헤더 네비게이션 변경 | `lib/constants.ts` → `SITE_CONFIG.navItems` |
| 새 카테고리 추가 | `lib/constants.ts` → `TECH_CATEGORIES` + `types/index.ts` → `TechCategory` |
| 새 난이도 추가 | `lib/constants.ts` → `DIFFICULTY_LABELS` + `types/index.ts` → `Difficulty` |
| Notion 이미지 hostname 추가 | `next.config.ts` → `images.remotePatterns` |
| 새 API Route 추가 | Route Handler + `revalidate` 또는 `dynamic` 반드시 선언 |
| 새 타입 추가 | `types/index.ts`만 수정 |
| Vercel Blob 새 파일 추가 | `lib/` 하위 전용 읽기/쓰기 함수 생성 + pathname 상수화 |

---

## 금지 사항

- `NOTION_DATABASE_ID` 환경변수 사용 (v2.0에서 `NOTION_MAIN_PAGE_ID`로 교체됨)
- `notion.databases.query()` 호출 (v4 API)
- `notion.dataSources.query()` 직접 호출 (싱글턴 `getNotionClient()` 경유 필수)
- `data/*.json` 로컬 파일 캐시 방식 (Vercel Blob으로 대체됨)
- `middleware.ts` 생성 (Next.js 16에서 `proxy.ts` 컨벤션 사용)
- `jsonwebtoken` 패키지 사용 (Edge Runtime 비호환, `jose` 사용)
- `next-themes` 패키지 설치 (ThemeProvider 자체 구현 중)
- `components/ui/` 파일 직접 수정
- `usehooks-ts` 직접 import (`@/hooks/*` 경유 필수)
- `types/index.ts` 외 별도 타입 파일 생성
- `any` 타입 사용
- 상대 경로 import (`../../` 대신 `@/` 절대 경로)
- `tailwind.config.*` 파일 생성
- 클라이언트 컴포넌트에서 `getNotionClient()` 호출
- 서버 컴포넌트에서 `useState`, `useEffect` 사용
- ISR 설정 없는 Route Handler 추가
- LLM 분석 모델 `claude-sonnet-4-6` 임의 변경
- 400ms delay 제거 또는 단축
