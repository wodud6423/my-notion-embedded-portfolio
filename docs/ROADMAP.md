# Embedded Tech Portfolio — 개발 로드맵

> PRD 버전: v2.0 | 최종 업데이트: 2026-05-13 | 전체 완료율: 100%

---

## 진행 현황 요약

| Phase | 이름 | 상태 | 완료율 |
|-------|------|------|--------|
| Phase 1 | MVP 기반 구축 | ✅ 완료 | 100% |
| Phase 2 | 데이터 레이어 재설계 | ✅ 완료 | 100% |
| Phase 3 | LLM 분석 엔진 | ✅ 완료 | 100% |
| Phase 4 | 관리자 페이지 + 인증 | ✅ 완료 | 100% |
| Phase 5 | 기술 스택 시각화 차트 | ✅ 완료 | 100% |
| Phase 6 | 이력서 다운로드 페이지 | ✅ 완료 | 100% |
| Phase 7 | 기존 API 호환성 연결 | ✅ 완료 | 100% |

---

## Phase 1 — MVP 기반 구축 (완료)

**목표:** Next.js 15 + Notion CMS 기반 기본 포트폴리오 웹사이트 완성

**대응 PRD 기능:** F001, F002, F003, F004, F005, F006, F007, F010, F011, F012

### 완료 항목

- [x] Next.js 15 + TypeScript + Tailwind CSS v4 + shadcn/ui 프로젝트 골격
- [x] Notion API 클라이언트 싱글턴 (`lib/notion.ts`)
- [x] Notion 응답 → TechStack 타입 변환 (`lib/tech-mapper.ts`)
- [x] Notion 블록 섹션 분리 파싱 (`lib/block-parser.ts`)
- [x] 홈 페이지 (`app/page.tsx`) — 기술 카드 그리드 + 필터
- [x] 카테고리 페이지 (`app/category/[category]/page.tsx`)
- [x] 기술 상세 페이지 (`app/tech/[id]/page.tsx`) — Notion 블록 렌더링
- [x] 검색 페이지 (`app/search/page.tsx`)
- [x] NotionBlockRenderer — 12개 블록 타입, Shiki 코드 하이라이팅
- [x] Zustand 필터 스토어 (`store/filter-store.ts`) — 카테고리/태그/난이도/검색 전역 상태
- [x] 반응형 그리드 레이아웃 (모바일 1열 / 태블릿 2열 / 데스크탑 3열)
- [x] Skeleton 로딩 + 에러 안내 처리 (`app/error.tsx`, `app/not-found.tsx`)
- [x] Vercel 배포 + ISR 60초 캐싱 (`export const revalidate = 60`)
- [x] 공개 API Route Handler (`app/api/tech/`, `app/api/tech/[id]/`, `app/api/tech/search/`)

---

## Phase 2 — 데이터 레이어 재설계 (완료)

**목표:** Notion 페이지 트리 탐색 + Vercel Blob 기반 JSON 캐시로 데이터 소스 전환

**대응 PRD 기능:** F020, F022

### 완료 항목

- [x] `lib/notion-tree.ts` — BSP 연구 페이지 하위 세부 주제 페이지 재귀 탐색, parentMap 생성
- [x] `lib/notion-page-reader.ts` — 페이지 블록 텍스트 추출 (최대 2000자)
- [x] `lib/tech-cache.ts` — Vercel Blob 기반 JSON 캐시 읽기/쓰기 (PRD 원안의 `data/*.json` 로컬 파일에서 Vercel Blob으로 교체)
- [x] `lib/pdf-meta.ts` — Vercel Blob 기반 PDF 메타 관리
- [x] `lib/notion.ts` 수정 — `getNotionDatabaseId()` 제거, `getNotionMainPageId()` 추가
- [x] `types/index.ts` 수정 — `CachedTechStack`, `TechCacheFile`, `NotionPageMeta`, `AdminAnalyzeResponse`, `PdfFileMeta` 타입 추가

> **설계 변경 (C1 Critical Fix):** PRD 원안의 `data/*.json` 로컬 파일 캐시는 Vercel 서버리스 환경에서 쓰기 불가. Vercel Blob으로 대체하여 영속적 캐시 저장 보장.

---

## Phase 3 — LLM 분석 엔진 (완료)

**목표:** Claude API로 Notion 페이지 자동 분석 → TechStack JSON 추출

**대응 PRD 기능:** F021, F024

### 완료 항목

- [x] `lib/llm-analyzer.ts` — Claude API (claude-sonnet-4-6) 분석 엔진
  - `analyzePage()`: 단일 Notion 페이지 분석 → TechStack JSON 추출
  - `analyzeAllPages()`: 전체 페이지 순차 처리 (400ms delay, Notion API RPS 3 이하 유지)
  - `generateChangeSummary()`: 50자 이내 변경 요약 생성
- [x] `app/api/admin/analyze/route.ts` — LLM 분석 트리거 API (`force-dynamic`)

> **설계 변경 (C3 Fix):** PRD 원안의 200ms delay를 400ms로 상향. Notion API 공식 RPS 한도(3 req/s) 준수를 위해 보수적으로 설정.

---

## Phase 4 — 관리자 페이지 + 인증 (완료)

**목표:** 비밀번호 인증 + 분석 트리거 + Notion 코멘트 + PDF 관리

**대응 PRD 기능:** F023, F024, F026, F027, F028, F029

### 완료 항목

- [x] `lib/auth.ts` — jose 기반 JWT 인증 (HS256, 만료 24시간, HttpOnly 쿠키)
- [x] `proxy.ts` — `/admin/**` 및 `/api/admin/**` 경로 JWT 보호 (Next.js 16 proxy 컨벤션으로 `middleware.ts` 대체)
- [x] `app/api/admin/login/route.ts` — 비밀번호 인증 → JWT 쿠키 발급
- [x] `app/api/admin/logout/route.ts` — JWT 쿠키 만료 처리
- [x] `app/api/admin/comment/route.ts` — Notion 페이지 코멘트 전송
- [x] `app/api/admin/upload-pdf/route.ts` — Vercel Blob PDF 업로드
- [x] `app/admin/login/page.tsx` — 비밀번호 로그인 폼 (React Hook Form + Zod)
- [x] `app/admin/layout.tsx` — 관리자 공통 레이아웃 (로그아웃 버튼 포함)
- [x] `app/admin/page.tsx` — 관리자 메인 (캐시 상태 + 분석 트리거 + 기술 테이블 + PDF 관리)
- [x] `components/admin/analyze-button.tsx` — 분석 트리거 버튼 + 완료 Dialog (50자 변경 요약 표시)
- [x] `components/admin/feedback-dialog.tsx` — Notion 피드백 코멘트 다이얼로그
- [x] `components/admin/tech-table.tsx` — 기술 스택 관리 테이블 (Notion 링크 + 피드백 버튼)
- [x] `components/admin/pdf-upload-card.tsx` — PDF 업로드 카드 (이력서 / 포트폴리오 구분)

> **설계 변경:** PRD 원안의 `middleware.ts`는 Next.js 16에서 `proxy.ts`로 컨벤션 변경. 동일한 JWT 검증 로직 유지.

---

## Phase 5 — 기술 스택 시각화 차트 (완료)

**목표:** recharts 막대 차트로 기술 분포 시각화

**대응 PRD 기능:** F031, F025

### 완료 항목

- [x] `components/charts/tech-distribution-chart.tsx` — recharts 카테고리별/난이도별 기술 수 분포 막대 차트 (클라이언트 컴포넌트)
- [x] `app/page.tsx` 수정 — 마지막 업데이트 날짜 표기 (F025) + 기술 분포 차트 섹션 추가 (F031)

---

## Phase 6 — 이력서 다운로드 페이지 (완료)

**목표:** 공개 PDF 다운로드 페이지

**대응 PRD 기능:** F030

### 완료 항목

- [x] `app/resume/page.tsx` — 이력서/포트폴리오 PDF 다운로드 페이지 (공개, 미업로드 시 "준비 중" 비활성화 상태 표시)
- [x] `lib/constants.ts` 수정 — 헤더 내비게이션에 Resume navItem 추가

---

## Phase 7 — 기존 API 호환성 연결 (완료)

**목표:** 기존 API Route를 Notion DB 직접 조회에서 Vercel Blob 캐시 기반으로 교체 (응답 스키마 동일 유지)

**대응 PRD 기능:** F001, F002, F005, F022

### 완료 항목

- [x] `app/api/tech/route.ts` — Notion DB → Vercel Blob 캐시 기반 메모리 필터링으로 교체
- [x] `app/api/tech/search/route.ts` — Notion DB → Vercel Blob 캐시 기반 텍스트 검색으로 교체
- [x] `app/api/tech/[id]/route.ts` — 메타(Vercel Blob 캐시) + 블록(Notion 실시간 조회) 혼합 방식으로 교체
- [x] `app/category/[category]/page.tsx` — Vercel Blob 캐시 기반으로 전환
- [x] `next.config.ts` — Vercel Blob URL `remotePatterns` 추가

---

## 아키텍처 설계 결정 사항

| 결정 | 내용 | 이유 |
|------|------|------|
| 캐시 저장소 | Vercel Blob (PRD 원안: 로컬 `data/*.json`) | Vercel 서버리스 환경에서 파일시스템 쓰기 불가 |
| Notion API delay | 400ms (PRD 원안: 200ms) | Notion 공식 RPS 한도 3 req/s 준수 |
| 경로 보호 | `proxy.ts` (PRD 원안: `middleware.ts`) | Next.js 16 proxy 컨벤션 적용 |
| 코드 하이라이팅 | Shiki (필요 언어만 동적 import) | 번들 크기 최소화 |
| JWT 라이브러리 | jose | Edge Runtime 호환 (Web Crypto API 기반) |

---

## 구현된 PRD 기능 매핑

### MVP 기능 (F001~F012)

| ID | 기능명 | 구현 위치 | 상태 |
|----|--------|-----------|------|
| F001 | 기술 목록 조회 | `app/api/tech/route.ts` | ✅ |
| F002 | 기술 상세 조회 | `app/api/tech/[id]/route.ts` | ✅ |
| F003 | 카테고리 필터링 | `store/filter-store.ts`, `app/api/tech/route.ts` | ✅ |
| F004 | 태그 필터링 | `store/filter-store.ts`, `app/api/tech/route.ts` | ✅ |
| F005 | 기술 검색 | `app/api/tech/search/route.ts`, `app/search/page.tsx` | ✅ |
| F006 | 난이도/중요도 표시 | `components/tech/tech-card.tsx` | ✅ |
| F007 | Notion 블록 렌더링 | `lib/block-parser.ts`, `components/notion-block-renderer.tsx` | ✅ |
| F010 | 기술 목록 카드 UI | `components/tech/tech-card.tsx` | ✅ |
| F011 | 반응형 레이아웃 | 전체 페이지 (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`) | ✅ |
| F012 | 오류 및 로딩 처리 | `app/error.tsx`, `app/not-found.tsx`, Skeleton 컴포넌트 | ✅ |

### 확장 기능 (F020~F031)

| ID | 기능명 | 구현 위치 | 상태 |
|----|--------|-----------|------|
| F020 | Notion 페이지 트리 탐색 | `lib/notion-tree.ts` | ✅ |
| F021 | LLM 기술 스택 분석 | `lib/llm-analyzer.ts` | ✅ |
| F022 | JSON 캐시 기반 서빙 | `lib/tech-cache.ts` (Vercel Blob) | ✅ |
| F023 | 관리자 인증 | `lib/auth.ts`, `proxy.ts`, `app/admin/login/` | ✅ |
| F024 | 관리자 분석 트리거 | `app/api/admin/analyze/route.ts`, `components/admin/analyze-button.tsx` | ✅ |
| F025 | 업데이트 날짜 표기 | `app/page.tsx` | ✅ |
| F026 | 변경 요약 알림 | `components/admin/analyze-button.tsx` (shadcn Dialog) | ✅ |
| F027 | Notion 페이지 직접 링크 | `components/admin/tech-table.tsx` | ✅ |
| F028 | Notion 피드백 코멘트 | `app/api/admin/comment/route.ts`, `components/admin/feedback-dialog.tsx` | ✅ |
| F029 | PDF 업로드 관리 | `app/api/admin/upload-pdf/route.ts`, `components/admin/pdf-upload-card.tsx` | ✅ |
| F030 | PDF 다운로드 페이지 | `app/resume/page.tsx` | ✅ |
| F031 | 기술 스택 분포 차트 | `components/charts/tech-distribution-chart.tsx` | ✅ |

---

## 리스크 레지스터

| ID | 리스크 | 심각도 | 상태 | 대응 |
|----|--------|--------|------|------|
| R001 | Notion API Rate Limit 초과 | 높음 | 완화됨 | LLM 분석 시 400ms delay 적용, 3 RPS 이하 유지 |
| R002 | Vercel Blob 쓰기 권한 미설정 | 높음 | 열림 | `BLOB_READ_WRITE_TOKEN` 환경변수 배포 전 반드시 설정 필요 |
| R003 | Anthropic API Key 미설정 | 높음 | 열림 | `ANTHROPIC_API_KEY` 환경변수 배포 전 반드시 설정 필요 |
| R004 | JWT_SECRET 미설정 또는 취약 | 높음 | 열림 | 32자 이상 랜덤 문자열로 설정 필요 |
| R005 | Shiki 번들 크기 과다 | 보통 | 완화됨 | 필요 언어만 동적 import하여 번들 최소화 |
| R006 | 캐시 미생성 상태의 방문자 접속 | 보통 | 열림 | 최초 배포 후 관리자가 반드시 한 번 분석 실행 필요 |
| R007 | LLM 분석 타임아웃 (대량 페이지) | 보통 | 열림 | Vercel 함수 실행 시간 한도 검토 필요 (현재 `force-dynamic`) |

---

## 미결 사항 (Open Questions)

| # | 질문 | 결정 |
|---|------|------|
| Q1 | `data/*.json` 로컬 파일 vs Vercel Blob | **Vercel Blob 채택** — 서버리스 환경에서 파일시스템 쓰기 불가로 결정 |
| Q2 | Notion API delay: 200ms vs 400ms | **400ms 채택** — 공식 RPS 한도 보수적 준수 |
| Q3 | `middleware.ts` vs `proxy.ts` | **`proxy.ts` 채택** — Next.js 16 신규 컨벤션 적용 |
| Q4 | 첫 배포 시 캐시 초기 데이터 필요 여부 | **미결** — 관리자 최초 분석 실행으로 해결 가능하나 `data/tech-cache.json` seed 파일 검토 여지 있음 |

---

## 환경변수 체크리스트 (배포 전 필수)

```bash
NOTION_TOKEN=ntn_...                  # Notion Integration Token
NOTION_MAIN_PAGE_ID=...               # BSP 연구 메인 페이지 ID
ADMIN_PASSWORD=...                    # 관리자 비밀번호
JWT_SECRET=...                        # 32자 이상 랜덤 문자열
ANTHROPIC_API_KEY=sk-ant-...          # Claude API 키
BLOB_READ_WRITE_TOKEN=vercel_blob_... # Vercel Blob 토큰
NEXT_PUBLIC_BASE_URL=https://...      # 배포 도메인
```

---

*문서 최초 작성: 2026-05-13*
*기준 PRD: v2.0 (2026-05-13 최종 업데이트)*
