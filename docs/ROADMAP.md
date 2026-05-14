# ROADMAP — Embedded Tech Portfolio

> 마지막 업데이트: 2026-05-13 | PRD 기반 버전: v2.0 | 전체 완료율: 100%

---

## 진행 현황

| Phase | 제목 | 목표 | 상태 | 완료율 |
|-------|------|------|------|--------|
| Phase 1 | 프로젝트 골격 | Next.js + 환경설정 + 레이아웃 | ✅ 완료 | 100% |
| Phase 2 | 공통 모듈 | 타입·유틸·훅·스토어·shadcn/ui | ✅ 완료 | 100% |
| Phase 3 | 핵심 기능 (MVP) | Notion 기술 카드·필터·검색·블록 렌더링 | ✅ 완료 | 100% |
| Phase 4 | 추가 기능 (MVP) | 로딩 스켈레톤·ISR·품질 검수·배포 | ✅ 완료 | 100% |
| Phase 5 | 데이터 레이어 재설계 | Notion 트리 탐색 + Vercel Blob 캐시 | ✅ 완료 | 100% |
| Phase 6 | LLM 분석 엔진 | Claude API 기반 TechStack 자동 추출 | ✅ 완료 | 100% |
| Phase 7 | 관리자 페이지 + 인증 | JWT 인증 + 분석 트리거 + PDF 관리 | ✅ 완료 | 100% |
| Phase 8 | 기술 스택 시각화 + 이력서 | recharts 차트 + PDF 다운로드 페이지 | ✅ 완료 | 100% |
| Phase 9 | API 호환성 연결 | 기존 API → Vercel Blob 캐시 기반 전환 | ✅ 완료 | 100% |

---

## Phase 1: 프로젝트 골격 — 완료

### 왜 이 순서인가?

폴더 구조, 경로 별칭(`@/*`), Tailwind v4 postcss 방식, globals.css 디자인 토큰이 확정되지 않으면 이후 모든 컴포넌트가 설정 변경 때마다 임포트 경로·CSS 클래스가 깨진다. 환경변수 체계도 가장 먼저 수립해야 Notion·Blob·Anthropic 키 없이 코드를 작성하는 실수를 방지할 수 있다. 레이아웃(Header/Footer/ThemeProvider) 역시 모든 페이지가 공유하므로 골격 단계에 포함한다.

### 작업 내용

- [x] **[Phase 1] Next.js 프로젝트 초기화 및 TypeScript 설정**
  - [x] `tsconfig.json` — strict 모드, `@/*` 경로 별칭
  - [x] `next.config.ts` — Turbopack 활성화, 이미지 remotePatterns
  - [x] `postcss.config.mjs` — Tailwind CSS v4 postcss 방식 (`tailwind.config.*` 없음)
  - [x] `package.json` — Next.js 16.2.4, React 19, TypeScript 5.6+ 의존성 정의

- [x] **[Phase 1] Tailwind CSS v4 및 shadcn/ui 초기화**
  - [x] `app/globals.css` — oklch 기반 CSS 커스텀 속성 (라이트/다크 토큰), `@import tailwindcss`
  - [x] `components.json` — shadcn/ui `radix-nova` 스타일, 경로 별칭 설정

- [x] **[Phase 1] 환경변수 및 보안 설정**
  - [x] `.env.example` — `NOTION_TOKEN`, `NOTION_DATABASE_ID`, `NEXT_PUBLIC_BASE_URL` 키 목록
  - [x] `.gitignore` — `.env.local` 제외 확인

- [x] **[Phase 1] 루트 레이아웃 및 공통 레이아웃 컴포넌트**
  - [x] `app/layout.tsx` — Geist 폰트, ThemeProvider, Header, Footer, Toaster 통합
  - [x] `components/providers/theme-provider.tsx` — localStorage 기반 자체 ThemeProvider (next-themes 미사용)
  - [x] `components/layout/header.tsx` — max-w-5xl 기준 sticky 헤더
  - [x] `components/layout/footer.tsx` — 푸터
  - [x] `components/layout/nav-links.tsx` — 네비게이션 링크 (홈/Kernel/Driver/RTOS/Yocto)
  - [x] `components/layout/mobile-menu.tsx` — 모바일 햄버거 Dialog 메뉴
  - [x] `components/layout/theme-toggle.tsx` — 라이트/다크/시스템 3단계 토글

- [x] **[Phase 1] 오류 페이지 및 404 페이지**
  - [x] `app/error.tsx` — 런타임 오류 ('use client' 필수), reset()/홈이동 버튼
  - [x] `app/not-found.tsx` — 404 안내 + 홈이동 버튼

### 예상 소요 시간

2일

### 완료 기준

- [x] `npm run dev` 정상 실행
- [x] `npm run build` TypeScript 오류 없음
- [x] 375px/768px/1280px 레이아웃 정상
- [x] 다크모드 토글 oklch 색상 전환 확인
- [x] `.env.local` git 미노출 확인

---

## Phase 2: 공통 모듈 — 완료

### 왜 이 순서인가?

`types/index.ts`, `lib/utils.ts`, `lib/constants.ts`, `hooks/`, `store/`, `components/ui/`는 이 프로젝트뿐 아니라 다른 프로젝트에서도 재사용 가능한 독립 모듈이다. 이 모듈들이 먼저 확정되어야 이후 Notion 데이터 계층, API Route Handler, 페이지 컴포넌트가 일관된 타입과 유틸리티를 참조할 수 있다. 특히 `TechStack`, `NotionBlock` 등 핵심 타입이 확정되지 않으면 매퍼·파서·API 응답 스키마가 모두 흔들린다.

### 작업 내용

- [x] **[Phase 2] Notion 데이터 계층 구현**
  - [x] `lib/notion.ts` — Notion 클라이언트 싱글턴, 환경변수 검증, `@notionhq/client v5` dataSources.query() 사용
  - [x] `lib/tech-mapper.ts` — `PageObjectResponse` → `TechStack` 변환 (7개 extract 함수)
  - [x] `lib/block-parser.ts` — Notion 블록 → `{concept, implementation, troubleshooting}` H2 헤딩 기준 섹션 분리 (한/영 지원)
  - [x] `lib/constants.ts` — `TECH_CATEGORIES`, `DIFFICULTY_LABELS`, `NOTION_REVALIDATE_SECONDS = 60`
  - [x] `lib/utils.ts` — `cn()` 유틸리티

- [x] **[Phase 2] TypeScript 타입 정의**
  - [x] `types/index.ts` — `TechStack`, `TechStackDetail`, `TechListResponse`, `SearchResponse`, `TechCategory`, `Difficulty`, `NotionBlock`(content: `Record<string, unknown>`), `FilterState` 전체 타입 (any 타입 없음)

- [x] **[Phase 2] 커스텀 훅 및 상태 관리**
  - [x] `hooks/use-debounce.ts` — usehooks-ts `useDebounceValue` re-export (튜플 반환)
  - [x] `hooks/use-local-storage.ts` — usehooks-ts re-export
  - [x] `hooks/use-media-query.ts` — usehooks-ts re-export
  - [x] `hooks/use-toast.ts` — globalThis 기반 커스텀 토스트 구현
  - [x] `store/filter-store.ts` — Zustand v5, `setCategory`/`toggleTag`/`clearTags`/`setDifficulty`/`setSearchKeyword`/`resetFilters` ('use client' 선언)

- [x] **[Phase 2] shadcn/ui 컴포넌트 설치**
  - [x] `components/ui/` — alert, badge, button, card, checkbox, dialog, input, label, radio-group, select, separator, switch, tabs, toast, toaster, tooltip 16개 컴포넌트 (radix-nova 스타일, 직접 수정 금지)

### 예상 소요 시간

2일

### 완료 기준

- [x] `npm run build` TypeScript 컴파일 오류 없음
- [x] `types/index.ts` any 타입 미사용
- [x] `components/ui/` 16개 파일 존재 확인
- [x] Zustand DevTools에서 필터 상태 변화 확인

---

## Phase 3: 핵심 기능 (MVP) — 완료

### 왜 이 순서인가?

포트폴리오의 핵심 가치는 기술 카드 목록 조회(F001), 카테고리/태그 필터(F003/F004), 검색(F005), 기술 상세 Notion 블록 렌더링(F002/F007)이다. 이 기능들이 동작하지 않으면 Phase 4(로딩 스켈레톤), Phase 5(데이터 레이어), Phase 6(LLM), Phase 7(관리자), Phase 8(차트)은 의미가 없다. API Route Handler가 먼저 완성되어야 클라이언트 컴포넌트가 올바른 응답을 검증하며 개발할 수 있다.

### 작업 내용

- [x] **[Phase 3] API Route Handler 구현**
  - [x] `app/api/tech/route.ts` — `force-dynamic`, category/tags/difficulty 필터, Importance 내림차순 정렬
  - [x] `app/api/tech/[id]/route.ts` — `revalidate=60`, 블록 파싱 포함
  - [x] `app/api/tech/search/route.ts` — `force-dynamic`, Title OR Summary 키워드 검색

- [x] **[Phase 3] TechCard 컴포넌트 및 카테고리 페이지**
  - [x] `components/tech/tech-card.tsx` — `Link→Card` 구조, 난이도별 배지 색상, 태그 5개 슬라이스+더보기, 중요도 ★ 표시
  - [x] `app/category/[category]/page.tsx` — `revalidate=60`, `generateStaticParams`, 반응형 그리드, Empty State

- [x] **[Phase 3] shiki 패키지 설치 및 TechGrid 컴포넌트 생성**
  - [x] `package.json` — shiki 의존성 추가
  - [x] `components/tech/tech-grid.tsx` — `TechStack[]` items props, Empty State UI, 반응형 그리드 (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`)
  - [x] `app/category/[category]/page.tsx` — 인라인 그리드 → TechGrid 교체
  - [x] `app/search/page.tsx` — TechGrid 교체

- [x] **[Phase 3] HomeTechList 클라이언트 컴포넌트 생성**
  - [x] `components/tech/home-tech-list.tsx` — 'use client', `initialItems` props, Zustand 필터 구독, `/api/tech` 재요청, `useTransition`+`AbortController` 패턴

- [x] **[Phase 3] 홈 페이지 Notion 실제 데이터 연동**
  - [x] `app/page.tsx` — async 서버 컴포넌트, `export const revalidate = 60`, `fetchInitialTechList()`, HomeTechList 통합

- [x] **[Phase 3] NotionBlockRenderer 기본 블록 컴포넌트 구현**
  - [x] `components/tech/notion-renderer/NotionBlockRenderer.tsx` — 블록 타입 분기 진입점, `renderRichText` 헬퍼, `getBlockData` 헬퍼, list 그룹화
  - [x] `components/tech/notion-renderer/ParagraphBlock.tsx` — paragraph 블록
  - [x] `components/tech/notion-renderer/HeadingBlock.tsx` — heading_1/2/3 → h2/h3/h4 매핑
  - [x] `components/tech/notion-renderer/BulletedListBlock.tsx` — bulleted_list_item 블록
  - [x] `components/tech/notion-renderer/NumberedListBlock.tsx` — numbered_list_item 블록
  - [x] `components/tech/notion-renderer/QuoteBlock.tsx` — quote 블록
  - [x] `components/tech/notion-renderer/DividerBlock.tsx` — divider 블록
  - [x] `components/tech/notion-renderer/UnsupportedBlock.tsx` — 미지원 블록 폴백 (개발 환경 only 경고)

- [x] **[Phase 3] CalloutBlock 및 CodeBlock(shiki) 구현**
  - [x] `components/tech/notion-renderer/CalloutBlock.tsx` — shadcn/ui Alert, emoji 아이콘 지원
  - [x] `components/tech/notion-renderer/CodeBlock.tsx` — async 서버 컴포넌트, shiki `codeToHtml`, github-dark 테마, C/C++/Shell/Bash/Python/Makefile 지원, 미지원 언어 plaintext 폴백
  - [x] `components/tech/notion-renderer/NotionBlockRenderer.tsx` — callout/code case 추가

- [x] **[Phase 3] 기술 상세 페이지 NotionBlockRenderer 연결**
  - [x] `app/tech/[id]/page.tsx` — 개념/구현 경험/트러블슈팅 3개 섹션 플레이스홀더 → NotionBlockRenderer 교체

- [x] **[Phase 3] Zustand 필터 스토어 및 검색 API**
  - [x] `store/filter-store.ts` — (Phase 2에서 완성, Phase 3에서 FilterBar와 연결)
  - [x] `app/api/tech/search/route.ts` — (Phase 3 API Route에서 완성)
  - [x] `hooks/use-debounce.ts` — (Phase 2에서 완성)

- [x] **[Phase 3] FilterBar 컴포넌트 구현**
  - [x] `components/tech/filter-bar.tsx` — 'use client', shadcn/ui Tabs 카테고리 탭(전체/Kernel/Driver/RTOS/Yocto), 임베디드 도메인 13개 공통 태그 Badge 토글, 난이도 Select, 활성 필터 표시 및 초기화 버튼, useFilterStore 연결

- [x] **[Phase 3] SearchInput 컴포넌트 및 검색 결과 페이지 연결**
  - [x] `components/layout/search-input.tsx` — 'use client', Input+검색아이콘, useDebounce 300ms, X 버튼 초기화, `/search?q=` 라우팅
  - [x] `app/search/page.tsx` — 재검색 입력창 추가, TechGrid 연결, Empty State 완성

### 예상 소요 시간

5~7일

### 완료 기준

- [x] `GET /api/tech` 200 응답, 필터 파라미터 정상 동작
- [x] `GET /api/tech/[유효ID]` 기술 상세 + 블록 반환
- [x] `GET /api/tech/search?q=키워드` 결과 반환
- [x] 기술 카드 그리드 반응형 정상 (1열/2열/3열)
- [x] Notion 블록 렌더링 12개 타입 동작
- [x] Shiki 코드 하이라이팅 적용 확인
- [x] 필터/검색 상태 변경 → TechGrid 업데이트

---

## Phase 4: 추가 기능 (MVP) — 완료

### 왜 이 순서인가?

로딩 스켈레톤(F012)과 ISR 캐싱 전환은 핵심 기능(Phase 3)이 완성된 이후 실제 렌더링 패턴을 보고 최적화해야 의미 있다. 미완성 기능에 스켈레톤을 붙이면 레이아웃 변경 시 이중 작업이 발생한다. 품질 검수와 배포는 당연히 기능 구현이 끝난 후 수행한다.

### 작업 내용

- [x] **[Phase 5] 로딩 스켈레톤 UI 및 Suspense 적용**
  - [x] `components/tech/tech-card-skeleton.tsx` — TechCard 동일 크기 스켈레톤, TechGridSkeleton (6개 3열×2행)
  - [x] `app/page.tsx` — HomeTechList 필터 변경 시 스켈레톤 교체
  - [x] `app/category/[category]/page.tsx` — 서버 컴포넌트(CategoryTechList) 분리, Suspense + TechGridSkeleton fallback
  - [x] `app/search/page.tsx` — 서버 컴포넌트(SearchResults) 분리, Suspense + TechGridSkeleton fallback
  - [x] `components/ui/skeleton.tsx` — shadcn/ui Skeleton 재사용

- [x] **[Phase 5] ISR 캐싱 최종 전환**
  - [x] `app/api/tech/route.ts` — `force-dynamic` 제거 → `revalidate=60`
  - [x] `app/api/tech/search/route.ts` — `force-dynamic` 제거 → `revalidate=60`
  - [x] `app/api/tech/[id]/route.ts` — 이미 `revalidate=60`, 유지

- [x] **[Phase 5] 품질 검수 및 반응형 최종 확인**
  - [x] `components/tech/home-tech-list.tsx` — `useTransition`+`AbortController` 패턴으로 ESLint 오류 수정
  - [x] `components/layout/search-input.tsx` — 중복 useEffect 제거
  - [x] ESLint/TypeScript 최종 오류 없음 확인

- [x] **[Phase 5] Vercel 배포 및 환경변수 등록**
  - [x] `.env.example` — 배포 체크리스트 참고
  - [x] `.gitignore` — `.env.local` 제외 확인
  - [x] Vercel Dashboard — `NOTION_TOKEN`, `NOTION_DATABASE_ID`, `NEXT_PUBLIC_BASE_URL` 등록 완료

### 예상 소요 시간

2~3일

### 완료 기준

- [x] Notion API 응답 대기 중 스켈레톤 카드 표시, 로드 완료 시 TechCard 교체
- [x] `npm run build` 후 `/api/tech`가 ISR 라우트로 표시
- [x] ESLint/TypeScript 오류 0건
- [x] Vercel Production URL에서 홈→카테고리→상세→검색 전 흐름 정상
- [x] `.env.local` git 미포함 확인

---

## Phase 5: 데이터 레이어 재설계 — 완료

### 왜 이 순서인가?

LLM 분석 엔진(Phase 6)과 관리자 페이지(Phase 7)는 Vercel Blob 기반 캐시 읽기/쓰기가 전제되어야 구현할 수 있다. PRD 원안의 로컬 `data/*.json` 파일 캐시는 Vercel 서버리스 환경에서 파일시스템 쓰기가 불가능하므로, Vercel Blob으로 대체 설계를 먼저 확정해야 이후 단계에서 잘못된 구현을 반복하지 않는다. `lib/notion-tree.ts`와 `lib/notion-page-reader.ts`도 LLM 분석의 입력 데이터를 준비하는 선행 작업이다.

### 작업 내용

- [x] **[Phase 2] Notion 페이지 트리 탐색 및 캐시 레이어 구현**
  - [x] `lib/notion-tree.ts` — BSP 연구 메인 페이지 하위 세부 주제 페이지 재귀 탐색, `parentMap` 생성, Depth 1 카테고리 컨텍스트 추출, Depth 2 분석 단위 수집
  - [x] `lib/notion-page-reader.ts` — 페이지 블록 텍스트 추출 (최대 2000자, 목차/인덱스 페이지 판별)
  - [x] `lib/tech-cache.ts` — Vercel Blob 기반 JSON 캐시 읽기/쓰기 (`TechCacheFile` 스키마, `updatedAt`, `updatedSummary`, `items[]`)
  - [x] `lib/pdf-meta.ts` — Vercel Blob 기반 PDF 메타 파일 관리 (`PdfFileMeta` 스키마)
  - [x] `lib/notion.ts` 수정 — `getNotionDatabaseId()` 제거, `getNotionMainPageId()` 추가
  - [x] `types/index.ts` 수정 — `CachedTechStack`, `TechCacheFile`, `NotionPageMeta`, `AdminAnalyzeResponse`, `PdfFileMeta` 타입 추가

> **설계 결정 (C1):** PRD 원안의 `data/*.json` 로컬 파일 캐시는 Vercel 서버리스 환경에서 쓰기 불가. **Vercel Blob으로 대체**하여 영속적 캐시 저장 보장.

### 예상 소요 시간

2~3일

### 완료 기준

- [x] `lib/notion-tree.ts` — Notion 메인 페이지에서 Depth 2 세부 주제 페이지 목록 수집 정상
- [x] `lib/tech-cache.ts` — Vercel Blob 읽기/쓰기 정상 동작
- [x] `types/index.ts` — 신규 타입 추가, TypeScript 컴파일 오류 없음
- [x] `BLOB_READ_WRITE_TOKEN` 환경변수 설정 확인

---

## Phase 6: LLM 분석 엔진 — 완료

### 왜 이 순서인가?

관리자 페이지(Phase 7)의 핵심 기능인 "Notion 분석 시작" 버튼(F024)은 LLM 분석 엔진이 완성된 이후에야 연결할 수 있다. 분석 엔진을 먼저 독립 라이브러리(`lib/llm-analyzer.ts`)로 구현해야 API Route Handler(`/api/admin/analyze`)에서 단순히 호출만 하면 되어 책임이 명확히 분리된다.

### 작업 내용

- [x] **[Phase 3] LLM 분석 엔진 및 API Route**
  - [x] `lib/llm-analyzer.ts` — Claude API (`claude-sonnet-4-6`) 분석 엔진
    - `analyzePage()`: 단일 Notion 페이지 분석 → TechStack JSON 추출
    - `analyzeAllPages()`: 전체 페이지 순차 처리 (400ms delay, Notion API RPS 3 이하 유지)
    - `generateChangeSummary()`: 50자 이내 변경 요약 생성
  - [x] `app/api/admin/analyze/route.ts` — LLM 분석 트리거 API (`force-dynamic`, JWT 인증 검증)

> **설계 결정 (C2):** PRD 원안의 200ms delay를 **400ms로 상향**. Notion API 공식 RPS 한도(3 req/s) 보수적 준수.

### 예상 소요 시간

2일

### 완료 기준

- [x] `POST /api/admin/analyze` — JWT 미인증 시 401, 인증 시 LLM 분석 트리거
- [x] `lib/llm-analyzer.ts` — Notion 페이지 텍스트 → `TechStack` JSON 추출 정상
- [x] 분석 완료 후 `BLOB_READ_WRITE_TOKEN`으로 Vercel Blob에 캐시 저장
- [x] `ANTHROPIC_API_KEY` 환경변수 설정 확인

---

## Phase 7: 관리자 페이지 + 인증 — 완료

### 왜 이 순서인가?

관리자 페이지(F023~F029)는 LLM 분석 엔진(Phase 6)과 Vercel Blob 캐시(Phase 5)가 모두 완성된 이후에야 실제로 동작 검증이 가능하다. JWT 인증 미들웨어(`proxy.ts`)를 먼저 배치하고, 이후 로그인→관리자 메인→분석 트리거→테이블→PDF 관리를 순서대로 구현한다.

### 작업 내용

- [x] **[Phase 4] 관리자 인증 기반 구현**
  - [x] `lib/auth.ts` — jose 기반 JWT 생성/검증 (HS256, 만료 24시간, HttpOnly 쿠키)
  - [x] `proxy.ts` — `/admin/**` 및 `/api/admin/**` 경로 JWT 검증 보호 (Next.js 16 proxy 컨벤션, PRD 원안 `middleware.ts` 대체)
  - [x] `app/api/admin/login/route.ts` — 비밀번호 인증 → JWT HttpOnly 쿠키 발급
  - [x] `app/api/admin/logout/route.ts` — JWT 쿠키 만료 처리
  - [x] `app/admin/login/page.tsx` — 비밀번호 로그인 폼 (React Hook Form + Zod 검증, 오류 메시지 표시)
  - [x] `app/admin/layout.tsx` — 관리자 공통 레이아웃 (로그아웃 버튼 포함)

- [x] **[Phase 4] 관리자 메인 페이지 및 핵심 컴포넌트**
  - [x] `app/admin/page.tsx` — 관리자 메인 (캐시 상태 + 분석 트리거 + 기술 테이블 + PDF 관리)
  - [x] `components/admin/analyze-button.tsx` — 분석 트리거 버튼 (스피너 표시), 완료 shadcn Dialog (50자 변경 요약 표시)
  - [x] `components/admin/tech-table.tsx` — 기술 스택 관리 테이블 (Notion 원본 페이지 직접 링크 + 피드백 버튼)
  - [x] `components/admin/feedback-dialog.tsx` — Notion 피드백 코멘트 다이얼로그 (React Hook Form + Zod)
  - [x] `components/admin/pdf-upload-card.tsx` — PDF 업로드 카드 (이력서/포트폴리오 구분)
  - [x] `app/api/admin/comment/route.ts` — Notion 페이지 코멘트 전송 API
  - [x] `app/api/admin/upload-pdf/route.ts` — Vercel Blob PDF 업로드 API

### 예상 소요 시간

3~4일

### 완료 기준

- [x] JWT 미인증 상태에서 `/admin` 접근 시 `/admin/login` 리디렉션
- [x] 로그인 성공 후 `/admin` 정상 접근
- [x] "Notion 분석 시작" 버튼 클릭 → 스피너 → 완료 Dialog (50자 요약)
- [x] 기술 테이블에서 Notion 원본 페이지 링크 클릭 시 Notion 페이지 이동
- [x] 피드백 버튼 클릭 → Notion 코멘트 전송 확인
- [x] PDF 업로드 → Vercel Blob 저장 확인
- [x] `JWT_SECRET`, `ADMIN_PASSWORD` 환경변수 설정 확인

---

## Phase 8: 기술 스택 시각화 + 이력서 다운로드 — 완료

### 왜 이 순서인가?

차트 시각화(F031)와 이력서 다운로드 페이지(F030)는 관리자 페이지(Phase 7)와 데이터 레이어(Phase 5)가 완성된 이후 실제 캐시 데이터를 기반으로 렌더링 결과를 검증할 수 있다. 차트는 `CachedTechStack[]`을 입력으로 받으므로 Vercel Blob 캐시가 존재해야 의미 있는 데이터를 표시할 수 있다.

### 작업 내용

- [x] **[Phase 5] 기술 스택 분포 차트 및 홈 페이지 업데이트**
  - [x] `components/charts/tech-distribution-chart.tsx` — recharts `BarChart`, 카테고리별/난이도별 기술 수 분포 막대 차트 (클라이언트 컴포넌트, 반응형)
  - [x] `app/page.tsx` 수정 — 마지막 업데이트 날짜 표기 섹션 (F025) + 기술 분포 차트 섹션 추가 (F031)

- [x] **[Phase 6] 이력서 다운로드 페이지**
  - [x] `app/resume/page.tsx` — 이력서/포트폴리오 PDF 다운로드 카드 (파일명, 업로드일, 다운로드 버튼), 미업로드 시 "준비 중" 비활성화 표시 (공개 접근)
  - [x] `lib/constants.ts` 수정 — 헤더 내비게이션에 Resume navItem 추가

### 예상 소요 시간

1~2일

### 완료 기준

- [x] 홈 페이지 하단 기술 분포 막대 차트 정상 렌더링
- [x] 마지막 업데이트 날짜 표기 (분석 후 자동 갱신)
- [x] `/resume` 페이지 접근 정상 (공개)
- [x] PDF 미업로드 시 "준비 중" 비활성화 상태 표시
- [x] 헤더 내비게이션에 Resume 메뉴 표시

---

## Phase 9: 기존 API 호환성 연결 — 완료

### 왜 이 순서인가?

기존 MVP API Route는 Notion DB를 직접 조회하는 방식이었다. Phase 5~6에서 Vercel Blob 캐시와 LLM 분석이 완성된 이후, 기존 API의 응답 스키마를 동일하게 유지하면서 데이터 소스만 캐시로 교체한다. 이를 마지막에 수행하는 이유는 캐시가 실제로 생성되지 않은 상태에서 API를 먼저 교체하면 방문자 접속 시 빈 응답을 반환하기 때문이다.

### 작업 내용

- [x] **[Phase 7] API 및 페이지 캐시 기반 전환**
  - [x] `app/api/tech/route.ts` — Notion DB 직접 조회 → Vercel Blob 캐시 기반 메모리 필터링으로 교체 (응답 스키마 동일 유지)
  - [x] `app/api/tech/search/route.ts` — Notion DB 직접 조회 → Vercel Blob 캐시 기반 텍스트 검색으로 교체
  - [x] `app/api/tech/[id]/route.ts` — 메타(Vercel Blob 캐시) + 블록(Notion 실시간 조회) 혼합 방식으로 교체
  - [x] `app/category/[category]/page.tsx` — Notion DB → Vercel Blob 캐시 기반으로 전환
  - [x] `next.config.ts` — Vercel Blob URL `remotePatterns` 추가

### 예상 소요 시간

1~2일

### 완료 기준

- [x] `GET /api/tech` — Vercel Blob 캐시 기반 필터링 응답 정상
- [x] `GET /api/tech/search?q=키워드` — 캐시 텍스트 검색 정상
- [x] `GET /api/tech/[id]` — 캐시 메타 + Notion 실시간 블록 혼합 응답 정상
- [x] 카테고리 페이지 Vercel Blob 캐시 기반 전환 확인
- [x] Vercel Blob URL 이미지 remotePatterns 정상 동작

---

## PRD 기능 ID 매핑 테이블

### MVP 기능 (F001~F012, v1.0)

| ID | 기능명 | 구현 위치 | Phase | 상태 |
|----|--------|-----------|-------|------|
| F001 | 기술 목록 조회 | `app/api/tech/route.ts` | Phase 3 → Phase 9 | ✅ |
| F002 | 기술 상세 조회 | `app/api/tech/[id]/route.ts` | Phase 3 → Phase 9 | ✅ |
| F003 | 카테고리 필터링 | `store/filter-store.ts`, `app/api/tech/route.ts`, `components/tech/filter-bar.tsx` | Phase 3 | ✅ |
| F004 | 태그 필터링 | `store/filter-store.ts`, `components/tech/filter-bar.tsx` | Phase 3 | ✅ |
| F005 | 기술 검색 | `app/api/tech/search/route.ts`, `components/layout/search-input.tsx`, `app/search/page.tsx` | Phase 3 → Phase 9 | ✅ |
| F006 | 난이도/중요도 표시 | `components/tech/tech-card.tsx` | Phase 3 | ✅ |
| F007 | Notion 블록 렌더링 | `lib/block-parser.ts`, `components/tech/notion-renderer/` (12개 블록, Shiki) | Phase 3 | ✅ |
| F010 | 기술 목록 카드 UI | `components/tech/tech-card.tsx`, `components/tech/tech-grid.tsx` | Phase 3 | ✅ |
| F011 | 반응형 레이아웃 | 전체 페이지 (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`) | Phase 1~3 | ✅ |
| F012 | 오류 및 로딩 처리 | `app/error.tsx`, `app/not-found.tsx`, `components/tech/tech-card-skeleton.tsx` | Phase 1, Phase 4 | ✅ |

### 확장 기능 (F020~F031, v2.0)

| ID | 기능명 | 구현 위치 | Phase | 상태 |
|----|--------|-----------|-------|------|
| F020 | Notion 페이지 트리 탐색 | `lib/notion-tree.ts` | Phase 5 | ✅ |
| F021 | LLM 기술 스택 분석 | `lib/llm-analyzer.ts` | Phase 6 | ✅ |
| F022 | JSON 캐시 기반 서빙 | `lib/tech-cache.ts` (Vercel Blob) | Phase 5 | ✅ |
| F023 | 관리자 인증 | `lib/auth.ts`, `proxy.ts`, `app/admin/login/` | Phase 7 | ✅ |
| F024 | 관리자 분석 트리거 | `app/api/admin/analyze/route.ts`, `components/admin/analyze-button.tsx` | Phase 6, Phase 7 | ✅ |
| F025 | 업데이트 날짜 표기 | `app/page.tsx` | Phase 8 | ✅ |
| F026 | 변경 요약 알림 | `components/admin/analyze-button.tsx` (shadcn Dialog, 50자 이내) | Phase 7 | ✅ |
| F027 | Notion 페이지 직접 링크 | `components/admin/tech-table.tsx` | Phase 7 | ✅ |
| F028 | Notion 피드백 코멘트 | `app/api/admin/comment/route.ts`, `components/admin/feedback-dialog.tsx` | Phase 7 | ✅ |
| F029 | PDF 업로드 관리 | `app/api/admin/upload-pdf/route.ts`, `components/admin/pdf-upload-card.tsx` | Phase 7 | ✅ |
| F030 | PDF 다운로드 페이지 | `app/resume/page.tsx` | Phase 8 | ✅ |
| F031 | 기술 스택 분포 차트 | `components/charts/tech-distribution-chart.tsx` | Phase 8 | ✅ |

---

## 아키텍처 설계 결정 사항

| 결정 ID | 결정 사항 | PRD 원안 | 실제 구현 | 이유 |
|---------|-----------|----------|-----------|------|
| C1 | 캐시 저장소 | `data/*.json` 로컬 파일 | **Vercel Blob** | Vercel 서버리스 환경에서 파일시스템 쓰기 불가 |
| C2 | Notion API delay | 200ms | **400ms** | Notion 공식 RPS 한도 3 req/s 보수적 준수 |
| C3 | 경로 보호 방식 | `middleware.ts` | **`proxy.ts`** | Next.js 16 신규 proxy 컨벤션 적용 |
| C4 | 코드 하이라이팅 | 미지정 | **Shiki** (필요 언어 동적 import) | 서버 컴포넌트 전용, 번들 크기 최소화 |
| C5 | JWT 라이브러리 | 미지정 | **jose** | Edge Runtime 호환 (Web Crypto API 기반) |
| C6 | 테마 관리 | 미지정 | **자체 ThemeProvider** (localStorage) | next-themes 미사용, Tailwind v4 oklch 토큰 직접 제어 |
| C7 | Notion API 버전 | 미지정 | **@notionhq/client v5** (`dataSources.query()`) | 최신 v5 API 사용 |

---

## 환경변수 체크리스트

```bash
# Notion 연동 (필수)
NOTION_TOKEN=ntn_...                  # Notion Integration Token
NOTION_MAIN_PAGE_ID=...               # BSP 연구 메인 페이지 ID (Depth 0)

# 관리자 인증 (필수)
ADMIN_PASSWORD=...                    # 관리자 비밀번호 (충분한 복잡도)
JWT_SECRET=...                        # JWT 서명 시크릿 (32자 이상 랜덤 문자열)

# LLM 분석 (필수)
ANTHROPIC_API_KEY=sk-ant-...          # Claude API 키 (claude-sonnet-4-6 모델)

# 파일 저장 (필수)
BLOB_READ_WRITE_TOKEN=vercel_blob_... # Vercel Blob 토큰 (캐시 + PDF 저장)

# 배포 도메인 (필수)
NEXT_PUBLIC_BASE_URL=https://...      # 배포 도메인 (로컬: http://localhost:3000)
```

> 주의: `NOTION_DATABASE_ID`는 Phase 5 이후 `NOTION_MAIN_PAGE_ID`로 대체됨. 기존 `.env.example`의 `NOTION_DATABASE_ID`는 v1.0 MVP에서만 사용했으며 v2.0에서는 불필요.

---

## 리스크 레지스터

| ID | 리스크 | 영향도 | 가능성 | 상태 | 완화 전략 |
|----|--------|--------|--------|------|-----------|
| R001 | Notion API Rate Limit 초과 | 높음 | 중간 | 완화됨 | LLM 분석 시 400ms delay 적용, 3 RPS 이하 유지 |
| R002 | Vercel Blob 쓰기 권한 미설정 | 높음 | 낮음 | 완화됨 | `BLOB_READ_WRITE_TOKEN` 환경변수 배포 전 등록 완료 |
| R003 | Anthropic API Key 미설정 | 높음 | 낮음 | 완화됨 | `ANTHROPIC_API_KEY` 환경변수 배포 전 등록 완료 |
| R004 | JWT_SECRET 취약 설정 | 높음 | 낮음 | 완화됨 | 32자 이상 랜덤 문자열 설정, `jose` HS256 사용 |
| R005 | Shiki 번들 크기 과다 | 보통 | 낮음 | 완화됨 | 필요 언어(C/C++/Shell/Bash/Python/Makefile)만 동적 import |
| R006 | 캐시 미생성 상태의 방문자 접속 | 보통 | 높음 | 열림 | 최초 배포 후 관리자가 반드시 한 번 분석 실행 필요 |
| R007 | LLM 분석 타임아웃 (대량 페이지) | 보통 | 중간 | 열림 | Vercel 함수 실행 시간 한도(최대 300초) 초과 시 페이지 분배 처리 검토 |
| R008 | Notion 페이지 구조 변경 | 보통 | 중간 | 열림 | Depth 2 탐색 로직(`lib/notion-tree.ts`)이 메인 페이지 구조에 의존적 — 구조 변경 시 로직 수정 필요 |
| R009 | LLM 분석 품질 (목차/인덱스 오분류) | 낮음 | 중간 | 완화됨 | `lib/notion-page-reader.ts`에서 목차 페이지 판별 후 `null` 반환하여 분석 제외 |

---

## 성공 지표 (PRD §10 기반)

| 지표 | 목표값 | 측정 방법 | 상태 |
|------|--------|----------|------|
| 홈 페이지 FCP | 2초 이내 | Vercel Speed Insights | ✅ |
| 기술 상세 페이지 로딩 | 3초 이내 | Vercel Speed Insights | ✅ |
| 모바일 레이아웃 정상 표시 | iOS Safari, Android Chrome 지원 | 직접 기기 확인 | ✅ |
| 전체 기술 스택 카드 정상 렌더링 | 100% | 브라우저 직접 확인 | ✅ |
| 카테고리/태그 필터 동작 정확도 | 100% | 수동 테스트 | ✅ |
| LLM 분석 성공률 | BSP 연구 페이지 90% 이상 TechStack 추출 | 관리자 페이지 직접 확인 | ✅ |
| 관리자 인증 보안 | JWT 미인증 시 `/admin` 접근 차단 | 브라우저 직접 확인 | ✅ |
| PDF 다운로드 | 업로드된 파일 정상 다운로드 | 브라우저 직접 확인 | ✅ |
| 차트 렌더링 | 기술 분포 차트 정상 표시 | 브라우저 직접 확인 | ✅ |
| 업데이트 날짜 표기 | 분석 후 홈 페이지에 날짜 표시 | 브라우저 직접 확인 | ✅ |

---

## 기술 표준 및 컨벤션

### 코딩 스타일

| 항목 | 기준 |
|------|------|
| 언어 | TypeScript strict (any 타입 금지, `Record<string, unknown>` 사용) |
| 들여쓰기 | 2칸 |
| 임포트 경로 | `@/*` 절대 경로 (상대 경로 금지) |
| 서버/클라이언트 | 서버 컴포넌트 기본, 클라이언트 필요 시만 `'use client'` |
| 반응형 | 모든 UI 컴포넌트 반응형 필수 |
| shadcn/ui | `npx shadcn@latest add <component>` 설치, `components/ui/` 직접 수정 금지 |

### 커밋 메시지

```
<type>(<scope>): <subject>

예시:
feat(admin): Notion 분석 트리거 API 구현
fix(cache): Vercel Blob 읽기 오류 수정
refactor(tech-card): 난이도 배지 색상 통일
```

### 컴포넌트 네이밍

| 유형 | 네이밍 | 위치 |
|------|--------|------|
| 페이지 | `page.tsx` (Next.js 규칙) | `app/` |
| UI 컴포넌트 | PascalCase | `components/` |
| 서버 유틸 | camelCase | `lib/` |
| 타입 | PascalCase interface | `types/index.ts` |
| Zustand 스토어 | `use[Name]Store` | `store/` |
| 커스텀 훅 | `use-[name].ts` | `hooks/` |

---

## 미결 사항 (Open Questions)

| # | 질문 | 결정 |
|---|------|------|
| Q1 | `data/*.json` 로컬 파일 vs Vercel Blob | **Vercel Blob 채택** — Vercel 서버리스 파일시스템 쓰기 불가 |
| Q2 | Notion API delay: 200ms vs 400ms | **400ms 채택** — 공식 RPS 한도 보수적 준수 |
| Q3 | `middleware.ts` vs `proxy.ts` | **`proxy.ts` 채택** — Next.js 16 proxy 컨벤션 |
| Q4 | 최초 배포 시 캐시 seed 파일 필요 여부 | **열림** — 관리자가 최초 분석 실행으로 해결 가능하나, 배포 직후 방문자 접속 시 빈 목록 노출 리스크 존재 |
| Q5 | LLM 분석 대상 페이지 필터링 정책 | **열림** — "[분석 대상]" 태그 기반 필터링 vs 전체 Depth 2 탐색 후 LLM에서 목차 판별 (현재: LLM 판별 방식 채택) |

---

## 핵심 설계 원칙

1. **서버 컴포넌트 우선**: Notion API, Vercel Blob, LLM API 호출은 반드시 서버 컴포넌트 또는 Route Handler에서만 실행
2. **클라이언트 최소화**: `'use client'`는 Zustand 구독, 브라우저 이벤트, recharts 등 필수 케이스에만 사용
3. **캐시 계층 분리**: 방문자 접속 경로(캐시 읽기)와 관리자 분석 경로(캐시 쓰기)를 명확히 분리
4. **타입 안전성**: `any` 타입 전면 금지, `Record<string, unknown>` 활용, Zod 폼 검증
5. **점진적 향상**: 캐시 미존재 시 빈 배열 폴백, API 오류 시 기존 데이터 유지

---

## 최종 목표

이 로드맵이 완성된 상태(현재):

- Notion에 임베디드 학습 문서를 작성하면 관리자 버튼 한 번으로 포트폴리오 웹사이트에 자동 반영
- 채용 담당자가 기술 카드 목록, 카테고리/태그/검색 필터로 기술 역량을 빠르게 탐색 가능
- Notion 원본 학습 내용을 웹에서 그대로 열람 (코드 하이라이팅 포함)
- 이력서/포트폴리오 PDF 다운로드 원스톱 제공
- 기술 스택 분포 차트로 전체 역량 영역을 한눈에 파악 가능
- JWT 인증 기반 관리자 전용 콘텐츠 관리 환경 완비

---

*문서 최초 작성: 2026-05-13*
*기준 PRD: v2.0 (2026-05-13 최종 업데이트)*
*전체 Phase 1~9 구현 완료 (100%)*
