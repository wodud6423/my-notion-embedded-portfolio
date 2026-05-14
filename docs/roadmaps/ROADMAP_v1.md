# ROADMAP — Embedded Tech Portfolio

> 마지막 업데이트: 2026-05-12 | PRD 기반 버전: v1.0 (MVP)

---

## 진행 현황

전체 5개 Phase 모두 완료 (100%)

| Phase | 제목 | 상태 | 완료율 |
|-------|------|------|--------|
| Phase 1 | 프로젝트 골격 | 완료 | 100% |
| Phase 2 | 공통 모듈 | 완료 | 100% |
| Phase 3 | 핵심 기능 | 완료 | 100% |
| Phase 4 | 추가 기능 | 완료 | 100% |
| Phase 5 | 최적화 및 배포 | 완료 | 100% |

---

## Phase 1: 프로젝트 골격 (상태: 완료) — 1일

### 왜 이 순서인가?

모든 개발의 전제조건이다. 폴더 구조, 경로 별칭(`@/*`), 환경변수 체계, 글로벌 스타일이 확정되지 않으면 이후 작성한 모든 코드가 기반을 바꿀 때마다 깨진다. 환경설정을 먼저 굳혀야 공통 모듈 작성 시 import 경로, 스타일 토큰, 환경변수 접근 방식을 일관되게 유지할 수 있다. 특히 Tailwind CSS v4의 postcss 방식과 shadcn/ui의 oklch 색상 시스템은 초기에 세팅하지 않으면 나중에 전체 스타일을 손대야 한다.

### 작업 내용

- [x] **[Phase 1] Next.js 프로젝트 초기화 및 TypeScript 설정**
  - [x] `tsconfig.json` — strict 모드, `@/*` 경로 별칭
  - [x] `next.config.ts` — Turbopack, 이미지 remotePatterns
  - [x] `postcss.config.mjs` — Tailwind CSS v4 postcss 방식

- [x] **[Phase 1] Tailwind CSS v4 및 shadcn/ui 초기화**
  - [x] `app/globals.css` — oklch 기반 CSS 커스텀 속성 (라이트/다크 토큰)
  - [x] `components.json` — shadcn/ui radix-nova 스타일 설정

- [x] **[Phase 1] 환경변수 및 보안 설정**
  - [x] `.env.example` — NOTION_TOKEN, NOTION_DATABASE_ID, NEXT_PUBLIC_BASE_URL 문서화
  - [x] `.gitignore` — `.env.local` 포함 확인

- [x] **[Phase 1] 루트 레이아웃 및 공통 레이아웃 컴포넌트**
  - [x] `app/layout.tsx` — Geist 폰트, ThemeProvider, Header, Footer, Toaster
  - [x] `components/providers/theme-provider.tsx` — 라이트/다크/시스템 토글
  - [x] `components/layout/header.tsx` — 스티키 헤더, 네비게이션
  - [x] `components/layout/footer.tsx` — 저작권, 소셜 링크
  - [x] `components/layout/nav-links.tsx` — 네비게이션 링크
  - [x] `components/layout/mobile-menu.tsx` — 모바일 햄버거 메뉴
  - [x] `components/layout/theme-toggle.tsx` — 테마 토글

- [x] **[Phase 1] 오류 페이지 및 404 페이지**
  - [x] `app/error.tsx` — `'use client'`, reset()/홈이동 버튼
  - [x] `app/not-found.tsx` — 404 안내 + 홈이동 버튼

### 예상 소요 시간

1일

### 완료 기준

- [x] `npm run dev` 실행 후 `localhost:3000` 정상 접속
- [x] `npm run build` TypeScript 컴파일 오류 없음
- [x] 다크모드 토글 시 oklch 색상 시스템 정상 전환
- [x] `.env.local`의 환경변수가 서버에서 `process.env`로 접근 가능

---

## Phase 2: 공통 모듈 (상태: 완료) — 2일

### 왜 이 순서인가?

공통 모듈은 이 프로젝트의 모든 기능이 공유하는 기반이다. 특히 `lib/`, `types/`, `hooks/`, `store/`, `components/layout/` 은 특정 기능에 종속되지 않고 **다른 웹 애플리케이션에서도 그대로 재사용 가능한 수준**으로 설계한다. 이 계층을 먼저 완성해야 핵심 기능(Phase 3)과 추가 기능(Phase 4) 개발 시 중복 코드 없이 일관된 인터페이스로 작업할 수 있다. Notion 클라이언트와 타입 변환 로직은 모든 API Route Handler의 선결 조건이므로 이 Phase에서 반드시 완료해야 한다.

### 작업 내용

- [x] **[Phase 2] Notion 데이터 계층 구현**
  - [x] `lib/notion.ts` — Notion 클라이언트 싱글턴 (환경변수 검증 포함)
  - [x] `lib/tech-mapper.ts` — Notion API 응답 → `TechStack` 타입 변환 (7개 함수)
  - [x] `lib/block-parser.ts` — Notion 블록 → 섹션 분리 (한/영 모두 지원)
  - [x] `lib/constants.ts` — 사이트 설정, 카테고리 목록, 난이도 레이블
  - [x] `lib/utils.ts` — `cn()` className 병합 유틸리티

- [x] **[Phase 2] TypeScript 타입 정의**
  - [x] `types/index.ts` — `TechStack`, `TechStackDetail`, `TechListResponse`, `SearchResponse`, `TechCategory`, `Difficulty`, `NotionBlock`, `FilterState` 등 완성

- [x] **[Phase 2] 커스텀 훅 및 상태 관리**
  - [x] `hooks/use-debounce.ts` — 입력 지연 처리 (검색 최적화용)
  - [x] `hooks/use-local-storage.ts` — LocalStorage 상태 동기화
  - [x] `hooks/use-media-query.ts` — 반응형 브레이크포인트 감지
  - [x] `hooks/use-toast.ts` — 토스트 알림 상태 관리
  - [x] `store/filter-store.ts` — Zustand 스토어 (카테고리/태그/난이도/검색 필터, `resetFilters`)

- [x] **[Phase 2] shadcn/ui 컴포넌트 설치**
  - [x] `components/ui/` — alert, badge, button, card, checkbox, dialog, input, label, radio-group, select, skeleton, tabs, toast, toaster, tooltip, switch 등 16개 컴포넌트

### 예상 소요 시간

2일

### 완료 기준

- [x] `lib/tech-mapper.ts` — Notion Page 객체를 `TechStack` 타입으로 변환하는 단위 테스트 통과 (또는 `console.log` 검증)
- [x] `lib/block-parser.ts` — H2 "개념", "구현 경험", "트러블슈팅" 헤딩으로 섹션 분리 검증
- [x] `types/index.ts` — TypeScript 컴파일 오류 없이 전체 빌드 통과
- [x] `store/filter-store.ts` — Zustand DevTools에서 상태 변화 확인 가능
- [x] 헤더/푸터 반응형 레이아웃 (375px / 768px / 1280px) 정상 표시

---

## Phase 3: 핵심 기능 (상태: 완료) — 3~4일

### 왜 이 순서인가?

이 포트폴리오의 존재 이유는 두 가지다: **"기술 목록을 한눈에 보여주는 것"** 과 **"각 기술의 실무 역량을 상세히 전달하는 것"**. 필터, 검색 같은 탐색 기능(Phase 4)은 목록과 상세 페이지가 완성된 이후에야 의미가 있다. 필터할 콘텐츠가 없으면 필터 UI를 만들어봤자 검증이 불가능하다. API Route Handler와 `TechCard` 컴포넌트는 Phase 4의 필터 UI, 검색 결과 페이지에서도 재사용되므로 이 Phase에서 먼저 완성해야 중복 작업이 없다.

### 작업 내용

- [x] **[Phase 3] API Route Handler 구현**
  - [x] `app/api/tech/route.ts` — `GET /api/tech` (카테고리/태그/난이도 필터, 중요도 내림차순 정렬)
  - [x] `app/api/tech/[id]/route.ts` — `GET /api/tech/[id]` (상세 메타 + Notion 블록 파싱, ISR 60초)
  - [x] `app/api/tech/search/route.ts` — `GET /api/tech/search?q=` (Title OR Summary 키워드 검색)

- [x] **[Phase 3] TechCard 컴포넌트 및 카테고리 페이지**
  - [x] `components/tech/tech-card.tsx` — 난이도 배지, 중요도 별, 태그 5개+더보기, 카드 클릭 → 상세 이동
  - [x] `app/category/[category]/page.tsx` — ISR 60초, `generateStaticParams`, TechGrid로 리팩터링

- [x] **[Phase 3] shiki 패키지 설치 및 TechGrid 컴포넌트 생성**
  - [x] `package.json` — shiki 패키지 설치 (코드 하이라이팅 사전 준비)
  - [x] `components/tech/tech-grid.tsx` — TechGrid 컴포넌트 (Empty State, 반응형 그리드 `sm:grid-cols-2 lg:grid-cols-3`)
  - [x] `app/category/[category]/page.tsx` — TechGrid 컴포넌트로 리팩터링 완료
  - [x] `app/search/page.tsx` — TechGrid 교체 완료 (`hasNoResult` 변수로 중복 조건 통합)

- [x] **[Phase 3] HomeTechList 클라이언트 컴포넌트 생성**
  - [x] `components/tech/home-tech-list.tsx` — `'use client'`, `initialItems: TechStack[]` props, `useFilterStore()` 구독, 필터 변경 시 `/api/tech` 재요청, 오류 시 기존 items 유지

- [x] **[Phase 3] 홈 페이지 Notion 실제 데이터 연동**
  - [x] `app/page.tsx` — `async` 서버 컴포넌트 전환, `export const revalidate = 60`, `fetchInitialTechList()`로 초기 fetch, "전체 기술 스택" 섹션 추가 → `<HomeTechList initialItems={...} />`

- [x] **[Phase 3] NotionBlockRenderer 기본 블록 컴포넌트 구현**
  - [x] `components/tech/notion-renderer/NotionBlockRenderer.tsx` — 블록 타입 분기 진입점, `renderRichText` 헬퍼, bulleted/numbered list 그룹화
  - [x] `components/tech/notion-renderer/ParagraphBlock.tsx` — 단락 (Rich text → bold/italic/code 변환)
  - [x] `components/tech/notion-renderer/HeadingBlock.tsx` — H1→h2 / H2→h3 / H3→h4 (페이지 h2 섹션명과 충돌 방지)
  - [x] `components/tech/notion-renderer/BulletedListBlock.tsx` — 글머리 기호 목록 (`<ul>`)
  - [x] `components/tech/notion-renderer/NumberedListBlock.tsx` — 번호 목록 (`<ol>`, 연속 블록 그룹화)
  - [x] `components/tech/notion-renderer/QuoteBlock.tsx` — 인용구 (좌측 border + italic)
  - [x] `components/tech/notion-renderer/DividerBlock.tsx` — 구분선
  - [x] `components/tech/notion-renderer/UnsupportedBlock.tsx` — 미지원 블록 폴백 (dev 환경에서만 표시)

- [x] **[Phase 3] CalloutBlock 및 CodeBlock(shiki) 구현**
  - [x] `components/tech/notion-renderer/CalloutBlock.tsx` — shadcn/ui `Alert` 활용, emoji 아이콘 지원
  - [x] `components/tech/notion-renderer/CodeBlock.tsx` — async 서버 컴포넌트, shiki `codeToHtml` github-dark 테마, C/C++/Shell/Bash/Python/Makefile 지원, 미지원 언어 plaintext 폴백

- [x] **[Phase 3] 기술 상세 페이지 NotionBlockRenderer 연결**
  - [x] `app/tech/[id]/page.tsx` — 플레이스홀더 div 제거, `<NotionBlockRenderer blocks={...} />` 연결 (개념/구현 경험/트러블슈팅 3개 섹션)

### 예상 소요 시간

3~4일 (블록 렌더러가 가장 복잡한 구현 단계)

### 기술 상세

```
app/
  page.tsx                       # 서버 컴포넌트 (초기 데이터 fetch)
    └── HomeTechList.tsx          # 클라이언트 컴포넌트 ('use client')
          └── TechGrid.tsx        # 카드 그리드 (Phase 4 FilterBar와 분리)

components/tech/notion-renderer/
  NotionBlockRenderer.tsx         # type 분기 → 하위 컴포넌트로 위임
  ParagraphBlock.tsx
  HeadingBlock.tsx
  BulletedListBlock.tsx
  NumberedListBlock.tsx
  CodeBlock.tsx                   # shiki (서버 컴포넌트에서 실행)
  QuoteBlock.tsx
  CalloutBlock.tsx
  DividerBlock.tsx
  UnsupportedBlock.tsx
```

Rich text의 `annotations` (bold, italic, code, strikethrough)는 인라인 `<strong>`, `<em>`, `<code>` 태그로 변환한다. `any` 타입 금지 — Notion 블록의 `content` 필드는 `Record<string, unknown>` + 타입 가드 패턴으로 처리한다.

### 완료 기준

- [x] `localhost:3000` 홈 페이지에서 Notion 데이터베이스의 실제 기술 카드가 렌더링됨
- [x] `/tech/[id]` 페이지에서 개념, 구현 경험, 트러블슈팅 섹션 내용이 실제로 표시됨
- [x] 코드 블록에 C, Shell 언어 구문 강조 정상 적용
- [x] 미지원 Notion 블록이 있어도 페이지가 깨지지 않음 (폴백 처리 확인)
- [x] 서버 컴포넌트에서 렌더링 (React DevTools에서 서버 컴포넌트 확인)
- [x] 데스크탑 3열 / 태블릿 2열 / 모바일 1열 반응형 그리드 확인

---

## Phase 4: 추가 기능 (상태: 완료) — 2~3일

### 왜 이 순서인가?

필터와 검색은 기술 목록과 상세 페이지(Phase 3)가 완성된 이후에야 의미 있는 UX를 제공한다. 탐색 기능은 콘텐츠가 충분히 축적되었을 때 가치가 극대화되므로, 핵심 콘텐츠 렌더링을 먼저 완성한 뒤 탐색 레이어를 얹는 것이 올바른 순서다. Phase 3에서 완성한 `TechCard`, `TechGrid`, API Route Handler를 그대로 재사용하므로 중복 없이 기능을 추가할 수 있다.

### 작업 내용

- [x] **[Phase 4] Zustand 필터 스토어 및 검색 API (완료)**
  - [x] `store/filter-store.ts` — `setCategory` / `toggleTag` / `setDifficulty` / `resetFilters`
  - [x] `app/api/tech/search/route.ts` — 키워드 검색 Route Handler
  - [x] `hooks/use-debounce.ts` — 300ms 디바운스

- [x] **[Phase 4] FilterBar 컴포넌트 구현**
  - [x] `components/tech/filter-bar.tsx` — shadcn/ui `Tabs` 카테고리 탭, 태그 멀티 선택 토글, 난이도 `Select`, 필터 초기화 버튼
  - [x] `app/page.tsx` — `FilterBar` 통합 (필터 변경 시 `/api/tech` 재요청)

- [x] **[Phase 4] SearchInput 컴포넌트 및 검색 결과 페이지 연결**
  - [x] `components/layout/search-input.tsx` — shadcn/ui `Input` + 검색 아이콘, `useDebounce` 300ms, `/search?q=` 라우팅
  - [x] `app/search/page.tsx` — 실제 API 호출 연결, Empty State UI, 검색어 헤딩 + 결과 수 표시

### 예상 소요 시간

2~3일

### 완료 기준

- [x] 카테고리 탭 클릭 시 해당 카테고리 기술만 표시됨
- [x] 태그 토글 클릭 시 해당 태그를 가진 기술만 표시됨
- [x] 필터 초기화 버튼 클릭 시 전체 목록으로 복귀됨
- [x] 홈 검색창에 키워드 입력 후 엔터 시 `/search?q=[keyword]`로 이동
- [x] 검색 결과 페이지에서 매칭 기술 카드 목록 표시
- [x] 검색 결과 없을 시 Empty State 메시지 표시
- [x] 빠른 타이핑 시 300ms 디바운스로 API 호출 횟수 제한 확인

---

## Phase 5: 최적화 및 배포 (상태: 완료) — 2일

### 왜 이 순서인가?

최적화는 기능이 완성된 이후에 진행해야 의미가 있다. 미완성 기능에 스켈레톤 UI나 ISR 튜닝을 적용하면 이후 기능 변경 시 최적화 코드를 다시 손봐야 하는 이중 작업이 발생한다. 또한 실제 사용 패턴을 보지 않고는 어디에 최적화가 필요한지 판단하기 어렵다. Vercel 배포는 환경변수 등 외부 시스템 의존성이 있어 개발 막바지에 집중적으로 처리하는 것이 효율적이다.

### 작업 내용

- [x] **[Phase 5] 로딩 스켈레톤 UI 및 Suspense 적용**
  - [x] `components/tech/tech-card-skeleton.tsx` — TechCard와 동일 크기, shadcn/ui `Skeleton`
  - [x] `app/page.tsx` — `Suspense` + 스켈레톤 적용
  - [x] `app/category/[category]/page.tsx` — `Suspense` + 스켈레톤 적용
  - [x] `app/search/page.tsx` — `Suspense` + 스켈레톤 적용

- [x] **[Phase 5] ISR 캐싱 최종 전환**
  - [x] `app/api/tech/route.ts` — `force-dynamic` 제거, `export const revalidate = 60` 적용
  - [x] `app/api/tech/search/route.ts` — `force-dynamic` 제거, `export const revalidate = 60` 적용
  - [x] 페이지 레벨 `export const revalidate = 60` 유지 확인

- [x] **[Phase 5] 품질 검수 및 반응형 최종 확인**
  - [x] Chrome DevTools: 375px(iPhone SE) / 768px(iPad) / 1280px(데스크탑) 전 구간 레이아웃 확인
  - [x] 다크모드 전체 페이지 적용 여부 최종 검수
  - [x] Lighthouse 성능 점수 90점 이상 달성

- [x] **[Phase 5] Vercel 배포 및 환경변수 등록**
  - [x] Vercel 프로젝트에 `NOTION_TOKEN`, `NOTION_DATABASE_ID`, `NEXT_PUBLIC_BASE_URL` 등록
  - [x] 배포 후 전체 사용자 흐름 검수 (홈 → 카테고리 → 상세 → 검색)
  - [x] `.env.local` 미노출 확인

### 예상 소요 시간

2일

### 완료 기준

- [x] 홈 페이지 FCP 2초 이내 (Chrome Lighthouse 기준)
- [x] Lighthouse 성능 점수 90점 이상
- [x] Notion API 응답 대기 중 스켈레톤 UI 표시 확인
- [x] Vercel 배포 URL에서 전체 페이지 정상 동작
- [x] `.env.local` 미포함 확인 (`git log` 검사)

---

## 의존성 맵

```
Phase 1 (프로젝트 골격)
  └── Phase 2 (공통 모듈)
        └── Phase 3 (핵심 기능)
              ├── Phase 4 (추가 기능)   ← Phase 3의 TechCard, TechGrid, API 재사용
              └── Phase 5 (최적화 및 배포)
```

Phase 3과 Phase 4는 순차 의존 관계다. `FilterBar`와 `SearchInput`은 `TechGrid`(Phase 3)를 재사용하므로 Phase 3이 완료된 이후에 구현한다.

---

## 데이터 흐름

```
[Notion 데이터베이스]
  ↓  @notionhq/client (서버 전용, NOTION_TOKEN 환경변수)
[lib/notion.ts]            — 클라이언트 싱글턴
  ↓
[lib/tech-mapper.ts]       — Notion 응답 → TechStack 타입 변환
[lib/block-parser.ts]      — 페이지 블록 → {concept, implementation, troubleshooting}
  ↓
[Route Handler]            — ISR revalidate = 60초
  /api/tech                — 목록 (카테고리/태그/난이도 필터)
  /api/tech/[id]           — 상세 (NotionBlock 배열 포함)
  /api/tech/search         — 키워드 검색
  ↓
[서버 컴포넌트]            — 초기 데이터 fetch (FCP 보장)
  app/page.tsx
  app/category/[category]/page.tsx
  app/tech/[id]/page.tsx
  app/search/page.tsx
  ↓
[클라이언트 컴포넌트]      — 필터 상태 관리 (Zustand)
  HomeTechList.tsx          — 필터 변경 시 /api/tech 재요청
  FilterBar.tsx             — 카테고리/태그/난이도 UI
  SearchInput.tsx           — 검색 입력 (useDebounce 300ms)
```

---

## 리스크 레지스터

| 리스크 | 영향도 | 가능성 | 완화 전략 |
|--------|--------|--------|-----------|
| Notion API Rate Limit (초당 3회) | 높음 | 보통 | ISR 60초 캐싱으로 서버 요청 최소화, 클라이언트에서 Notion API 직접 호출 절대 금지 |
| Notion 블록 타입 미지원 | 보통 | 높음 | `UnsupportedBlock` 폴백으로 페이지 렌더링 중단 방지 |
| `force-dynamic` 설정으로 ISR 미적용 | 높음 | 높음 | Phase 5에서 `/api/tech/*` 전체 `revalidate = 60` 일괄 확인 |
| shiki 번들 크기 증가 | 보통 | 보통 | 필요 언어(C, Shell, Python)만 import, 서버 컴포넌트에서만 실행 |
| Zustand 상태와 URL 파라미터 불일치 | 보통 | 보통 | 검색은 URL `searchParams` 기반, Zustand는 홈/카테고리 필터 전용으로 역할 분리 |
| Vercel 환경변수 미설정 배포 오류 | 높음 | 낮음 | 배포 전 `.env.example` 체크리스트 확인 |

---

## 기술 표준 및 컨벤션

### 서버 / 클라이언트 컴포넌트 분리 원칙

- **서버 컴포넌트** (기본값): Notion API 호출, 초기 데이터 fetch — `'use client'` 없음
- **클라이언트 컴포넌트**: Zustand 구독, 이벤트 핸들러, `useState` / `useEffect` — 파일 상단 `'use client'` 명시
- Notion API 호출은 반드시 서버 컴포넌트 또는 Route Handler에서만 실행

### 타입 정의 원칙

- `any` 타입 사용 절대 금지
- Notion 블록의 `content` 필드 → `Record<string, unknown>` + 타입 가드로 처리
- Notion API 응답 원본은 `@notionhq/client` 타입 활용, 변환 후 타입은 `types/index.ts` 인터페이스 사용

### 스타일링 규칙

- Tailwind CSS v4 (postcss 방식, `tailwind.config.*` 없음)
- 반응형 그리드 패턴 통일: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- 색상: `app/globals.css`의 oklch CSS 커스텀 속성 사용
- shadcn/ui 컴포넌트 추가: `npx shadcn@latest add <component>`

### 커밋 메시지 규칙

```
feat: Notion 블록 렌더러 컴포넌트 구현
fix: ISR revalidate 설정 누락 수정
style: 홈 페이지 반응형 그리드 레이아웃 조정
refactor: tech-mapper 함수 타입 가드 추가
chore: shiki 코드 하이라이팅 패키지 설치
```

---

## 미결 사항 (Open Questions)

| # | 항목 | 배경 | 결정 필요 시점 |
|---|------|------|----------------|
| Q1 | 코드 하이라이팅 라이브러리 선택 — `shiki` vs `highlight.js` | `shiki`는 서버 사이드 렌더링 친화적이나 설정 복잡, `highlight.js`는 클라이언트 사이드 단순 | Phase 3 시작 전 |
| Q2 | 홈 페이지 히어로 섹션 유지 여부 | 현재 히어로 + 카테고리 카드 구조를 유지할지, 기술 카드 그리드로 완전 교체할지 | Phase 3 시작 전 |
| Q3 | 이전/다음 기술 내비게이션 MVP 포함 여부 | PRD에 명시되어 있으나 Notion 정렬 순서 기준 설정 복잡, MVP 범위 포함 여부 결정 필요 | Phase 3 진행 중 |
| Q4 | 태그 필터 데이터 소스 — 정적 목록 vs Notion API 동적 집계 | `constants.ts`에 하드코딩 vs `/api/tech` 응답에서 동적 집계 | Phase 4 시작 전 |
| Q5 | Route Handler ISR 전환 방법 확인 | Next.js 15 App Router에서 Route Handler의 `revalidate` vs `force-dynamic` 동작 확인 필요 | Phase 5 진행 중 |

---

## 성공 지표 (KPIs)

| 지표 | 목표값 | 측정 방법 |
|------|--------|----------|
| 홈 페이지 FCP | 2초 이내 | Chrome Lighthouse / Vercel Speed Insights |
| 기술 상세 페이지 로딩 | 3초 이내 | Chrome Lighthouse |
| Lighthouse 성능 점수 | 90점 이상 | Chrome DevTools Lighthouse |
| Notion API 오류율 | 5% 미만 | Vercel 함수 로그 |
| 전체 기술 카드 렌더링 | 100% | 브라우저 직접 확인 |
| 카테고리/태그 필터 정확도 | 100% | 수동 테스트 |
| 기술 상세 3개 섹션 렌더링 | 개념/구현/트러블슈팅 모두 표시 | 브라우저 직접 확인 |
| 모바일 정상 표시 | iOS Safari, Android Chrome | 직접 기기 또는 DevTools 에뮬레이션 |

---

## 핵심 설계 원칙

1. **Notion을 단일 진실 공급원(Single Source of Truth)으로 유지**: 모든 기술 콘텐츠는 Notion에서 관리하며 웹사이트는 조회 전용이다.

2. **서버 컴포넌트 우선**: Notion API 호출은 반드시 서버에서만 실행. 클라이언트 컴포넌트는 필터/검색 상호작용에만 한정한다.

3. **ISR로 성능과 최신성 균형 확보**: `revalidate = 60`으로 Notion 수정 사항을 최대 60초 내에 반영하면서 FCP를 보장한다.

4. **컴포넌트 재사용으로 일관성 보장**: `TechCard`, `TechGrid`는 홈/카테고리/검색 결과 전 페이지에서 동일하게 사용한다. 페이지별 변형은 props로 처리한다.

5. **타입 안전성으로 Notion 응답 오류 사전 차단**: `any` 타입 금지. Notion 블록의 불확실한 필드는 `Record<string, unknown>` + 타입 가드 패턴으로 처리한다.

---

## 최종 목표

Notion에 임베디드 기술 문서를 작성하면 별도 배포 없이 포트폴리오에 자동 반영되는 **완전 자동화된 기술 역량 전달 시스템**을 완성한다.

채용 담당자가 방문했을 때:
- 전체 임베디드 기술 스택을 카드 그리드로 한눈에 파악
- 관심 카테고리(Kernel/Driver/RTOS/Yocto)나 태그(GPIO/UART/I2C)로 즉시 필터링
- 특정 기술 클릭 시 개념 설명 + 실제 구현 경험 + 트러블슈팅을 한 페이지에서 확인

이론 지식과 실무 역량을 동시에, 효과적으로 전달하는 포트폴리오를 구축한다.

---

*문서 작성일: 2026-05-07*
*PRD 버전: v1.0 (MVP)*
*프로젝트: Embedded Tech Portfolio*
