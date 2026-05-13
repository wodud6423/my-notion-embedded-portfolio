# Embedded Tech Portfolio PRD

## 목차

1. [프로젝트 개요 및 목표](#1-프로젝트-개요-및-목표)
2. [사용자 스토리](#2-사용자-스토리)
3. [기능 요구사항](#3-기능-요구사항)
4. [비기능 요구사항](#4-비기능-요구사항)
5. [기술 스택 및 아키텍처](#5-기술-스택-및-아키텍처)
6. [Notion 페이지 구조 및 데이터 스키마](#6-notion-페이지-구조-및-데이터-스키마)
7. [화면 구성 및 라우팅](#7-화면-구성-및-라우팅)
8. [API 설계](#8-api-설계)
9. [구현 단계 및 일정](#9-구현-단계-및-일정)
10. [성공 지표](#10-성공-지표)

---

## 1. 프로젝트 개요 및 목표

**목적:** Notion에 정리된 임베디드 기술 스택 및 학습 내용을 기반으로, 채용 담당자와 동료 개발자에게 기술 역량을 효과적으로 전달하는 기술 중심 포트폴리오 웹사이트 구축

**사용자:**
- **방문자**: 임베디드 시스템 개발자의 기술 역량을 검토하는 채용 담당자 및 동료 개발자
- **관리자**: 포트폴리오 운영자 (사이트 소유자)

### 핵심 사용 흐름

```
[관리자]
  │  Notion 페이지 트리에 기술 학습 문서 작성
  ↓
[관리자 페이지 (/admin)]
  │  "Notion 분석 시작" 버튼 클릭
  │  LLM(Claude API)이 Notion 페이지를 분석 → TechStack JSON 캐시 생성
  ↓
[방문자 접속]
  │  기술 카드 목록, 카테고리/태그/검색 필터로 탐색
  │  기술 상세 페이지에서 Notion 원본 내용 열람
  │  이력서/포트폴리오 PDF 다운로드
  ↓
[기술 스택 분포 시각화]
  │  홈 하단 막대 차트로 카테고리별·난이도별 분포 한눈에 파악
```

### 목표

- Notion 페이지 트리를 단일 CMS로 활용하여 별도 관리 도구 없이 웹 콘텐츠 반영
- LLM 분석 기반으로 비정형 Notion 학습 문서에서 기술 스택 메타데이터 자동 추출
- 기술 스택을 카테고리, 태그, 난이도, 중요도로 체계적으로 분류하여 빠른 탐색 제공
- 이력서 및 기술 포트폴리오 PDF 다운로드로 취업 관련 자료 통합 제공
- 기술 스택 분포 시각화로 전체 역량을 한눈에 파악 가능하게 함

---

## 2. 사용자 스토리

### 방문자 (채용 담당자 / 동료 개발자)

| ID | 사용자 스토리 | 중요도 |
|----|--------------|--------|
| US-01 | 방문자로서 기술 스택 전체 목록을 한눈에 확인하고 싶다. 어떤 기술을 보유했는지 빠르게 파악하기 위해. | 높음 |
| US-02 | 방문자로서 Kernel, Driver, RTOS, Yocto 등 카테고리별로 기술을 필터링하고 싶다. 내가 관심 있는 기술 영역에 집중하기 위해. | 높음 |
| US-03 | 방문자로서 GPIO, UART, SPI 등 특정 태그로 기술을 필터링하고 싶다. 세부 기술 경험을 확인하기 위해. | 높음 |
| US-04 | 방문자로서 기술명 또는 키워드로 검색하고 싶다. 특정 기술의 보유 여부와 수준을 빠르게 확인하기 위해. | 높음 |
| US-05 | 방문자로서 특정 기술의 상세 페이지에서 Notion에 작성된 학습 내용을 확인하고 싶다. 실무 역량을 평가하기 위해. | 높음 |
| US-06 | 방문자로서 기술별 난이도와 중요도를 시각적으로 확인하고 싶다. 해당 기술에 대한 자신감과 숙련도를 판단하기 위해. | 보통 |
| US-07 | 방문자로서 기술 스택 분포를 차트로 보고 싶다. 전체 역량 영역을 한눈에 파악하기 위해. | 보통 |
| US-08 | 방문자로서 이력서와 기술 포트폴리오 PDF를 다운받고 싶다. 오프라인에서도 검토하기 위해. | 높음 |

### 관리자 (포트폴리오 운영자)

| ID | 사용자 스토리 | 중요도 |
|----|--------------|--------|
| US-09 | 관리자로서 Notion에 새 기술 문서를 작성 후 분석 버튼 하나로 웹사이트에 반영하고 싶다. 별도 배포 없이 콘텐츠를 관리하기 위해. | 높음 |
| US-10 | 관리자로서 각 기술 스택에서 원본 Notion 페이지로 바로 이동하고 싶다. 빠르게 내용을 수정하기 위해. | 높음 |
| US-11 | 관리자로서 특정 기술 스택에 피드백 메시지를 Notion 코멘트로 전송하고 싶다. 수정이 필요한 내용을 메모하기 위해. | 보통 |
| US-12 | 관리자로서 이력서와 기술 포트폴리오 PDF를 업로드하여 방문자가 다운받을 수 있게 하고 싶다. | 높음 |
| US-13 | 관리자로서 분석 업데이트 후 변경된 내용을 간략하게 확인하고 싶다. 무엇이 바뀌었는지 파악하기 위해. | 보통 |

---

## 3. 기능 요구사항

### 3.1 MVP 완료 기능 (v1.0)

| ID | 기능명 | 설명 | 상태 |
|----|--------|------|------|
| **F001** | 기술 목록 조회 | 캐시 기반 전체 기술 스택 목록 조회 | ✅ 완료 |
| **F002** | 기술 상세 조회 | 특정 기술의 Notion 페이지 블록(학습 내용) 조회 | ✅ 완료 |
| **F003** | 카테고리 필터링 | Kernel / Driver / RTOS / Yocto 등 카테고리별 필터링 | ✅ 완료 |
| **F004** | 태그 필터링 | GPIO / UART / I2C / SPI 등 태그 기반 필터링 | ✅ 완료 |
| **F005** | 기술 검색 | 기술명 또는 키워드로 기술 목록 검색 | ✅ 완료 |
| **F006** | 난이도/중요도 표시 | 각 기술 카드에 난이도·중요도 배지 표시 | ✅ 완료 |
| **F007** | Notion 블록 렌더링 | Notion 페이지 블록을 웹 형식으로 렌더링 (12개 블록 타입, Shiki 코드 하이라이팅) | ✅ 완료 |
| **F010** | 기술 목록 카드 UI | 기술명, 요약, 카테고리, 태그, 난이도를 카드 형식으로 표시 | ✅ 완료 |
| **F011** | 반응형 레이아웃 | 데스크탑/태블릿/모바일 모든 화면에서 정상 표시 | ✅ 완료 |
| **F012** | 오류 및 로딩 처리 | Notion API 응답 지연 시 Skeleton, 오류 시 안내 메시지 | ✅ 완료 |

### 3.2 확장 기능 (v2.0)

| ID | 기능명 | 설명 | 우선순위 | 관련 페이지 |
|----|--------|------|---------|------------|
| **F020** | Notion 페이지 트리 탐색 | 메인 페이지 → BSP 연구 페이지들 → 세부 주제 페이지들을 재귀 탐색 | 핵심 | 내부 로직 |
| **F021** | LLM 기술 스택 분석 | Claude API로 Notion 페이지 내용 분석 → TechStack JSON 자동 추출 | 핵심 | 관리자 페이지 |
| **F022** | JSON 캐시 기반 서빙 | LLM 분석 결과를 JSON 캐시에 저장하여 방문자에게 빠르게 서빙 | 핵심 | 전체 |
| **F023** | 관리자 인증 | JWT 기반 비밀번호 인증으로 관리자 페이지 보호 | 핵심 | /admin |
| **F024** | 관리자 분석 트리거 | 관리자 페이지에서 "Notion 분석 시작" 버튼으로 LLM 분석 수동 실행 | 핵심 | /admin |
| **F025** | 업데이트 날짜 표기 | 홈 페이지에 마지막 기술 스택 업데이트 날짜 표시 | 필수 | 홈 페이지 |
| **F026** | 변경 요약 알림 | 분석 완료 후 50자 이내 변경 내용 요약 알림 Dialog 표시 | 필수 | 관리자 페이지 |
| **F027** | Notion 페이지 직접 링크 | 관리자 페이지 기술 테이블에서 원본 Notion 페이지로 이동 | 높음 | /admin |
| **F028** | Notion 피드백 코멘트 | 관리자가 기술 스택 피드백 메시지를 Notion 페이지 코멘트로 전송 | 보통 | /admin |
| **F029** | PDF 업로드 관리 | 관리자가 이력서/포트폴리오 PDF 파일을 Vercel Blob에 업로드 | 높음 | /admin |
| **F030** | PDF 다운로드 페이지 | 방문자가 이력서·기술 포트폴리오 PDF를 다운로드 | 높음 | /resume |
| **F031** | 기술 스택 분포 차트 | 카테고리별·난이도별 기술 수를 막대 차트로 시각화 (recharts) | 보통 | 홈 페이지 |

### 3.3 구현하지 않는 기능

- 자동 업데이트 (LLM 분석은 관리자 버튼 클릭으로만 실행)
- 기술별 조회수 통계 대시보드
- 방문자 댓글 또는 피드백 기능
- 기술 비교 기능
- RSS 피드 또는 뉴스레터 구독
- 다국어(영문) 지원

---

## 4. 비기능 요구사항

### 4.1 성능

- 홈 페이지 First Contentful Paint: 2초 이내 (JSON 캐시 기반 서빙)
- API 응답: ISR(Incremental Static Regeneration) 60초 간격 재검증
- LLM 분석: 관리자 버튼 클릭 후 수 분 소요 가능 (진행 중 스피너 표시)
- 이미지 최적화: Next.js Image 컴포넌트 사용

### 4.2 반응형 지원

| 구간 | 너비 | 카드 컬럼 수 |
|------|------|-------------|
| 데스크탑 | 1280px 이상 | 3열 |
| 태블릿 | 768px ~ 1279px | 2열 |
| 모바일 | 375px ~ 767px | 1열 |

지원 브라우저: Chrome 최신, Safari 최신, Edge 최신, Firefox 최신

### 4.3 접근성

- 방문자: 로그인 없이 전체 포트폴리오 열람 가능 (공개 포트폴리오)
- 관리자: 비밀번호 인증 후 /admin 접근 가능
- HTTPS 필수 (Vercel 자동 적용)
- 시맨틱 HTML 마크업 사용

### 4.4 보안

- Notion Integration Token은 서버 환경변수에만 저장 (클라이언트 노출 금지)
- Anthropic API Key는 서버 환경변수에만 저장 (LLM 분석 서버에서만 호출)
- 관리자 인증: JWT (HS256, 만료 24시간) + HttpOnly 쿠키
- JWT_SECRET, ADMIN_PASSWORD는 서버 환경변수에만 저장
- /admin 경로 및 /api/admin/** 은 미들웨어에서 JWT 검증 후 접근 허용
- LLM 분석은 관리자 인증된 요청에서만 실행 가능 (사용자 페이지 차단)

---

## 5. 기술 스택 및 아키텍처

### 5.1 기술 스택

#### 프론트엔드 프레임워크

- **Next.js 15** (App Router) - React 풀스택 프레임워크, 서버 컴포넌트 + ISR 캐싱
- **React 19** - UI 라이브러리
- **TypeScript 5.6+** - 타입 안전성 (`any` 타입 금지)

#### 스타일링 및 UI

- **Tailwind CSS v4** - 유틸리티 CSS (postcss 방식, 설정 파일 없음)
- **shadcn/ui** - Badge, Card, Input, Tabs, Select, Dialog, Toast 등
- **Lucide React** - 아이콘 라이브러리
- **recharts** - 기술 스택 분포 막대 차트

#### 폼 및 검증

- **React Hook Form 7.x** - 관리자 로그인 폼, 피드백 폼 관리
- **Zod** - 폼 스키마 검증

#### 상태 관리

- **Zustand** - 카테고리/태그 필터 선택 상태, 검색 키워드 전역 관리

#### CMS 연동 및 분석

- **@notionhq/client** - Notion API 공식 클라이언트 SDK (페이지 트리 탐색, 블록 조회, 코멘트 생성)
- **@anthropic-ai/sdk** - Claude API (claude-sonnet-4-6 모델로 기술 스택 분석)

#### 인증

- **jose** - JWT 생성/검증 (Web Crypto API 기반, Edge Runtime 호환)

#### 파일 저장

- **@vercel/blob** - PDF 파일 영구 저장 (Vercel Blob Storage)
- **JSON 파일 캐시** - LLM 분석 결과 (`data/tech-cache.json`), PDF 메타 (`data/pdf-meta.json`)

#### 배포

- **Vercel** - Next.js 최적화 배포 플랫폼, 환경변수 관리

### 5.2 아키텍처 구성도

```
[관리자 버튼 클릭 시만 — 자동 업데이트 없음]

Notion 메인 페이지 (293b2b03...)
  └─ RTOS 연구 페이지 (Depth 1, 카테고리 힌트)
      └─ | RTOS Introduction |         (Depth 2, 분석 단위 = 기술 스택 1개)
      └─ | FreeRTOS Task Creation |    (Depth 2)
  └─ 드라이버 개발 페이지 (Depth 1)
      └─ 세부 주제들 (Depth 2) ...
  └─ 커널 페이지 (Depth 1) ...
         ↓
POST /api/admin/analyze (관리자 JWT 인증 필요)
  ├─ lib/notion-tree.ts: Depth 2 세부 페이지 목록 수집 + parentMap
  ├─ lib/notion-page-reader.ts: 각 페이지 텍스트 추출 (최대 2000자)
  ├─ lib/llm-analyzer.ts: Claude API (claude-sonnet-4-6) 순차 분석
  │   └─ 페이지 제목 + 내용 + 부모 카테고리 힌트 → TechStack JSON
  └─ lib/tech-cache.ts: data/tech-cache.json 저장 + 50자 변경 요약 생성
         ↓ 완료 알림: shadcn Dialog (50자 이내 변경 요약)
         ↓ 홈 페이지: 마지막 업데이트 날짜 자동 표기

[방문자 접속 시 — 캐시 기반 서빙]

data/tech-cache.json
  ├─ GET /api/tech → 메모리 필터링 (category/tags/difficulty)
  ├─ GET /api/tech/search → 메모리 텍스트 검색
  └─ GET /api/tech/[id] → 메타(캐시) + 블록(Notion 실시간 조회)

Next.js 서버 컴포넌트 → 클라이언트
  ├─ 홈(/): 기술 카드 + 마지막 업데이트 날짜 + 차트 (하단)
  ├─ /category/**, /tech/**, /search: 기존 동일
  ├─ /resume: 이력서/포트폴리오 PDF 다운로드 (공개)
  └─ /admin: 관리자 전용 (JWT 인증 필요)
      ├─ /admin/login: 비밀번호 로그인
      └─ /admin: 분석 트리거 + 기술 테이블 + PDF 관리
```

### 5.3 데이터 흐름

**관리자 분석 플로우:**
1. 관리자가 `/admin`에서 "Notion 분석 시작" 버튼 클릭
2. `POST /api/admin/analyze` 호출 (JWT 인증 검증)
3. `lib/notion-tree.ts`가 메인 페이지에서 BSP 연구 페이지들 하위의 세부 주제 페이지 목록 수집
4. `lib/notion-page-reader.ts`가 각 페이지 블록을 텍스트로 추출 (최대 2000자)
5. `lib/llm-analyzer.ts`가 Claude API에 순차 전달하여 TechStack JSON 추출
6. `lib/tech-cache.ts`가 `data/tech-cache.json` 저장
7. 변경 요약(50자) Dialog 표시 후 페이지 새로고침

**방문자 접속 플로우:**
1. 방문자가 포트폴리오 웹사이트 접속
2. 서버 컴포넌트가 `data/tech-cache.json`에서 TechStack 목록 조회
3. 기술 카드 그리드, 업데이트 날짜, 차트 렌더링
4. 방문자가 기술 카드 클릭 → `/tech/[id]`에서 Notion 블록 실시간 조회 + 렌더링

### 5.4 환경변수 구성

```bash
# .env.local

# Notion 연동 (필수)
NOTION_TOKEN=ntn_...                  # Notion Integration Token
NOTION_MAIN_PAGE_ID=293b2b03...       # 기술 포트폴리오 메인 페이지 ID

# 관리자 인증 (필수)
ADMIN_PASSWORD=...                    # 관리자 비밀번호
JWT_SECRET=...                        # JWT 서명 시크릿 (32자 이상)

# LLM 분석 (필수)
ANTHROPIC_API_KEY=sk-ant-...          # Claude API 키

# PDF 저장 (필수)
BLOB_READ_WRITE_TOKEN=vercel_blob_... # Vercel Blob 토큰

# 배포 도메인
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## 6. Notion 페이지 구조 및 데이터 스키마

### 6.1 실제 Notion 페이지 트리 구조

```
메인 페이지: "BSP 염재영 연구원 - 연구 자료 페이지 모음"
  │
  ├── [분석 대상] BSP 개발 관련 연구 문서 페이지
  │   ├── RTOS 관련 개발 연구          → category: 'RTOS'
  │   │   ├── | RTOS Introduction |   → TechStack 1개
  │   │   ├── | FreeRTOS Task Creation | → TechStack 1개
  │   │   └── ... (세부 주제 페이지들)
  │   ├── 디바이스 드라이버 개발 문서   → category: 'Driver'
  │   ├── 디버깅을 통해 배우는 리눅스 커널의 구조와 원리 → category: 'Kernel'
  │   ├── Microcontroller 관련 연구 개발 → category: 'Driver'
  │   ├── 임베디드 리눅스 프로그래밍   → category: 'Kernel'
  │   └── Yocto Linux Kernel Build Guide → category: 'Yocto'
  │
  ├── [제외] 코딩관련 연구 자료 페이지
  ├── [제외] 이외 개발 연구 참고 자료 페이지
  └── [제외] AI 툴 사용 연구
```

**분석 규칙:**
- Depth 1 페이지 (연구 분야 페이지): 카테고리 컨텍스트로만 활용
- Depth 2 페이지 (세부 주제 페이지): LLM 분석 단위 (기술 스택 1개)
- 목차/인덱스 페이지로 판단되면 null 반환하여 제외

### 6.2 LLM 추출 TechStack 스키마

LLM이 각 Notion 세부 주제 페이지를 분석하여 아래 구조로 추출합니다.

| 필드 | 타입 | 설명 | 예시 |
|------|------|------|------|
| `title` | string | 간결한 기술명 | "FreeRTOS Task 생성" |
| `category` | TechCategory | 기술 분류 | "RTOS" |
| `tags` | string[] | 관련 태그 | ["FreeRTOS", "STM32", "RTOS"] |
| `summary` | string | 기술 한 줄 요약 (100자 이내) | "FreeRTOS에서 태스크를 생성하고..." |
| `difficulty` | Difficulty | 난이도 | "Intermediate" |
| `importance` | number | 중요도 (1~5) | 4 |

### 6.3 캐시 데이터 스키마

```typescript
// lib/tech-cache.ts에서 관리
interface CachedTechStack extends TechStack {
  notionPageId: string  // Notion 원본 페이지 ID (= id와 동일)
  notionUrl: string     // https://notion.so/{pageId}
}

interface TechCacheFile {
  updatedAt: string          // ISO 8601 업데이트 시각
  updatedSummary: string     // 50자 이내 변경 요약
  items: CachedTechStack[]   // 분석된 기술 스택 목록
}
```

### 6.4 TypeScript 타입 정의

```typescript
// 기술 스택 기본 타입
interface TechStack {
  id: string              // Notion Page ID
  title: string           // 기술 이름
  category: TechCategory  // 카테고리
  tags: string[]          // 태그 목록
  summary: string         // 한 줄 요약
  difficulty: Difficulty  // 난이도
  importance: number      // 중요도 (1~5)
  createdAt: string       // ISO 8601
}

// 캐시 기술 스택 (Notion URL 포함)
interface CachedTechStack extends TechStack {
  notionPageId: string
  notionUrl: string
}

// 기술 상세 (블록 포함)
interface TechStackDetail extends TechStack {
  content: {
    concept: NotionBlock[]
    implementation: NotionBlock[]
    troubleshooting: NotionBlock[]
  }
}

// PDF 메타
interface PdfFileMeta {
  type: 'resume' | 'portfolio'
  url: string
  uploadedAt: string
  fileName: string
}

// 관리자 분석 응답
interface AdminAnalyzeResponse {
  success: boolean
  updatedAt: string
  updatedSummary: string
  itemCount: number
  error?: string
}

type TechCategory = 'Kernel' | 'Driver' | 'RTOS' | 'Yocto' | 'Other'
type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'
```

---

## 7. 화면 구성 및 라우팅

### 7.1 사용자 여정

```
[방문자 접속]
  ↓
홈 페이지 (기술 스택 카드 목록 + 업데이트 날짜 + 하단 분포 차트)
  ↓ 카테고리 탭 클릭
카테고리 페이지 (특정 카테고리 기술 목록)
  ↓ 기술 카드 클릭
기술 상세 페이지 (Notion 학습 내용 렌더링)

  ↓ 검색창 키워드 입력
검색 결과 페이지 → 기술 상세 페이지

  ↓ 헤더 Resume 클릭
이력서 다운로드 페이지 (PDF 다운로드)

[관리자 접속]
  ↓
/admin/login (비밀번호 입력)
  ↓
/admin (관리자 메인)
  ├─ Notion 분석 시작 버튼 → LLM 분석 → 변경 요약 Dialog
  ├─ 기술 스택 테이블 (Notion 링크 + 피드백 버튼)
  └─ PDF 업로드 관리
```

### 7.2 메뉴 구조

```
포트폴리오 내비게이션 (헤더)
├── 홈 (전체 기술 목록)
├── Kernel
├── Driver
├── RTOS
├── Yocto
└── Resume (이력서/포트폴리오 다운로드)
```

### 7.3 라우팅 구조

| 페이지 | 경로 | 접근 | 설명 |
|--------|------|------|------|
| 홈 | `/` | 공개 | 전체 기술 스택 카드 목록 + 분포 차트 |
| 카테고리 | `/category/[category]` | 공개 | 특정 카테고리 기술 목록 |
| 기술 상세 | `/tech/[id]` | 공개 | Notion 학습 내용 렌더링 |
| 검색 결과 | `/search?q=[keyword]` | 공개 | 검색 결과 목록 |
| 이력서 | `/resume` | 공개 | PDF 다운로드 |
| 관리자 로그인 | `/admin/login` | 공개 | 비밀번호 입력 |
| 관리자 | `/admin` | 인증 필요 | LLM 트리거 + 기술 관리 + PDF 관리 |

### 7.4 페이지별 상세 기능

---

#### 홈 페이지

> **구현 기능:** `F001`, `F003`, `F004`, `F005`, `F006`, `F010`, `F011`, `F025`, `F031` | **접근:** 공개

| 항목 | 내용 |
|------|------|
| **역할** | 전체 기술 스택을 카드 목록으로 보여주는 포트폴리오 메인 랜딩 페이지 |
| **주요 기능** | 기술 카드 그리드, 카테고리/태그/난이도 필터, 검색 입력창, 마지막 업데이트 날짜 표시, 하단 기술 분포 막대 차트 |
| **다음 이동** | 카드 클릭 → 기술 상세 페이지, 검색 입력 → 검색 결과 페이지, 카테고리 탭 → 카테고리 페이지 |

---

#### 카테고리 페이지

> **구현 기능:** `F001`, `F003`, `F010`, `F011` | **접근:** 공개

| 항목 | 내용 |
|------|------|
| **역할** | 특정 카테고리(Kernel/Driver/RTOS/Yocto)에 속하는 기술만 필터링하여 표시 |
| **주요 기능** | 카테고리명 헤딩, 기술 카드 그리드, 태그 필터, 기술 수 표시 |

---

#### 기술 상세 페이지

> **구현 기능:** `F002`, `F006`, `F007`, `F011` | **접근:** 공개

| 항목 | 내용 |
|------|------|
| **역할** | Notion 세부 주제 페이지의 학습 내용을 웹으로 렌더링 |
| **주요 기능** | 기술명 헤딩, 카테고리/태그/난이도/중요도 메타, Notion 블록 렌더링 (코드 블록 Shiki 하이라이팅) |

---

#### 이력서 다운로드 페이지 (신규)

> **구현 기능:** `F030` | **접근:** 공개

| 항목 | 내용 |
|------|------|
| **역할** | 이력서 및 기술 포트폴리오 PDF 다운로드 제공 |
| **주요 기능** | 이력서 카드 (파일명, 업로드일, 다운로드 버튼), 기술 포트폴리오 카드 |
| **미업로드 시** | "준비 중입니다" 비활성화 상태 표시 |

---

#### 관리자 로그인 페이지 (신규)

> **구현 기능:** `F023` | **접근:** 공개 (인증 전)

| 항목 | 내용 |
|------|------|
| **역할** | 관리자 비밀번호 인증 |
| **주요 기능** | 비밀번호 입력 폼, 오류 메시지 표시, 성공 시 /admin으로 이동 |

---

#### 관리자 페이지 (신규)

> **구현 기능:** `F024`, `F025`, `F026`, `F027`, `F028`, `F029` | **접근:** 인증 필요

| 항목 | 내용 |
|------|------|
| **역할** | LLM 분석 트리거 + 기술 스택 관리 + PDF 업로드 관리 |
| **주요 기능** | 현재 캐시 상태 (업데이트 날짜, 기술 수), Notion 분석 시작 버튼 (스피너 → 변경 요약 Dialog), 기술 스택 테이블 (Notion 링크 + 피드백 버튼), PDF 업로드 카드 |

---

#### 오류 페이지

> **구현 기능:** `F012` | **접근:** 공개

| 항목 | 내용 |
|------|------|
| **역할** | 존재하지 않는 페이지 접근 또는 오류 발생 시 안내 |
| **주요 기능** | 오류 메시지, 홈으로 이동 버튼 |

---

## 8. API 설계

### 8.1 공개 API (방문자)

| 메서드 | 경로 | 설명 | 캐싱 전략 | 데이터 소스 |
|--------|------|------|----------|------------|
| `GET` | `/api/tech` | 전체 기술 스택 목록 (필터 지원) | ISR 60초 | JSON 캐시 메모리 필터링 |
| `GET` | `/api/tech/[id]` | 기술 상세 (메타 + Notion 블록) | ISR 60초 | 메타: 캐시, 블록: Notion 실시간 |
| `GET` | `/api/tech/search` | 키워드 검색 | ISR 60초 | JSON 캐시 텍스트 검색 |

### 8.2 관리자 API (인증 필요)

| 메서드 | 경로 | 설명 |
|--------|------|------|
| `POST` | `/api/admin/login` | 비밀번호 인증 → JWT 쿠키 발급 |
| `POST` | `/api/admin/logout` | JWT 쿠키 만료 처리 |
| `POST` | `/api/admin/analyze` | Notion 페이지 트리 탐색 + LLM 분석 + 캐시 저장 |
| `POST` | `/api/admin/comment` | Notion 페이지에 코멘트 전송 |
| `POST` | `/api/admin/upload-pdf` | PDF 파일 Vercel Blob 업로드 |

### 8.3 쿼리 파라미터

#### `GET /api/tech`

| 파라미터 | 타입 | 설명 | 예시 |
|---------|------|------|------|
| `category` | string | 카테고리 필터 | `?category=Kernel` |
| `tags` | string | 태그 필터 (콤마 구분) | `?tags=GPIO,UART` |
| `difficulty` | string | 난이도 필터 | `?difficulty=Advanced` |

### 8.4 응답 데이터 구조

#### 기술 목록 응답 (`GET /api/tech`)

```typescript
interface TechListResponse {
  items: TechStack[]
  total: number
}
```

#### 기술 상세 응답 (`GET /api/tech/[id]`)

```typescript
interface TechDetailResponse extends TechStack {
  content: {
    concept: NotionBlock[]
    implementation: NotionBlock[]
    troubleshooting: NotionBlock[]
  }
}
```

#### 검색 응답 (`GET /api/tech/search`)

```typescript
interface SearchResponse {
  keyword: string
  items: TechStack[]
  total: number
}
```

#### 관리자 분석 응답 (`POST /api/admin/analyze`)

```typescript
interface AdminAnalyzeResponse {
  success: boolean
  updatedAt: string
  updatedSummary: string  // 50자 이내
  itemCount: number
  error?: string
}
```

### 8.5 lib/ 유틸리티 구조

```
lib/
├── notion.ts              # Notion 클라이언트 싱글턴 + getNotionMainPageId()
├── notion-tree.ts         # Notion 페이지 트리 재귀 탐색
├── notion-page-reader.ts  # 페이지 블록 → 텍스트 추출
├── tech-mapper.ts         # Notion 응답 → TechStack 변환 (기존)
├── block-parser.ts        # Notion 블록 → 렌더링 구조 변환 (기존)
├── tech-cache.ts          # JSON 캐시 읽기/쓰기
├── llm-analyzer.ts        # Claude API 분석 엔진
├── auth.ts                # JWT 관리자 인증
├── pdf-meta.ts            # PDF 메타 파일 관리
├── constants.ts           # 사이트 설정, 카테고리, 상수
└── utils.ts               # cn() 유틸리티
```

---

## 9. 구현 단계 및 일정

### Phase 1 (완료) - MVP 기반 구축

**목표:** 기본 포트폴리오 웹사이트 완성
- ✅ Next.js 15 + TypeScript + Tailwind CSS v4 + shadcn/ui 프로젝트 골격
- ✅ Notion API 클라이언트 + 기술 매퍼 + 블록 파서
- ✅ 홈, 카테고리, 기술 상세, 검색 페이지
- ✅ NotionBlockRenderer (12개 블록 타입, Shiki 코드 하이라이팅)
- ✅ Zustand 필터 스토어
- ✅ Vercel 배포 + ISR 캐싱

---

### Phase 2 (신규) - 데이터 레이어 재설계

**목표:** Notion 페이지 트리 탐색 + JSON 캐시 기반으로 데이터 소스 전환

- [ ] `lib/notion-tree.ts`: BSP 연구 페이지 하위 세부 주제 페이지 재귀 탐색
- [ ] `lib/notion-page-reader.ts`: 페이지 블록 → 텍스트 추출 (최대 2000자)
- [ ] `lib/tech-cache.ts`: JSON 캐시 읽기/쓰기
- [ ] `lib/pdf-meta.ts`: PDF 메타 파일 관리
- [ ] `lib/notion.ts` 수정: `getNotionDatabaseId()` 제거, `getNotionMainPageId()` 추가
- [ ] `types/index.ts` 수정: 신규 타입 추가
- [ ] `data/.gitkeep` 생성, `.gitignore`에 `data/*.json` 추가

---

### Phase 3 (신규) - LLM 분석 엔진

**목표:** Claude API로 Notion 페이지 자동 분석 → TechStack 추출

- [ ] `lib/llm-analyzer.ts`: Claude API (claude-sonnet-4-6) 분석 엔진
  - `analyzePage()`: 단일 페이지 분석
  - `analyzeAllPages()`: 순차 처리 (200ms delay)
  - `generateChangeSummary()`: 50자 이내 변경 요약
- [ ] `app/api/admin/analyze/route.ts`: LLM 분석 트리거 API (`force-dynamic`)

---

### Phase 4 (신규) - 관리자 페이지 + 인증

**목표:** 비밀번호 인증 + 분석 트리거 + Notion 코멘트 + PDF 관리

- [ ] `lib/auth.ts`: JWT 인증 (jose, HS256, 24시간)
- [ ] `middleware.ts`: `/admin/**` 및 `/api/admin/**` 경로 보호
- [ ] `app/api/admin/login/route.ts`, `app/api/admin/logout/route.ts`
- [ ] `app/api/admin/comment/route.ts`: Notion 코멘트 전송
- [ ] `app/api/admin/upload-pdf/route.ts`: Vercel Blob 업로드
- [ ] `app/admin/login/page.tsx`: 로그인 폼
- [ ] `app/admin/layout.tsx`: 관리자 레이아웃 (로그아웃 버튼)
- [ ] `app/admin/page.tsx`: 관리자 메인 (캐시 상태 + 분석 트리거 + 기술 테이블 + PDF 관리)
- [ ] `components/admin/analyze-button.tsx`: 분석 트리거 버튼 + 완료 Dialog
- [ ] `components/admin/feedback-dialog.tsx`: 피드백 코멘트 다이얼로그
- [ ] `components/admin/tech-table.tsx`: 기술 스택 관리 테이블
- [ ] `components/admin/pdf-upload-card.tsx`: PDF 업로드 카드

---

### Phase 5 (신규) - 기술 스택 시각화 차트

**목표:** recharts 막대 차트로 기술 분포 시각화

- [ ] `components/charts/tech-distribution-chart.tsx`: 카테고리별/난이도별 분포 차트
- [ ] `app/page.tsx` 수정: 업데이트 날짜 + 차트 섹션 추가

---

### Phase 6 (신규) - 이력서 다운로드 페이지

**목표:** 공개 PDF 다운로드 페이지

- [ ] `app/resume/page.tsx`: 이력서/포트폴리오 PDF 다운로드 페이지
- [ ] `lib/constants.ts` 수정: Resume navItem 추가

---

### Phase 7 (신규) - 기존 API 호환성 연결

**목표:** 기존 API Route를 캐시 기반으로 교체 (응답 스키마 동일 유지)

- [ ] `app/api/tech/route.ts` 수정: 캐시 기반 메모리 필터링
- [ ] `app/api/tech/search/route.ts` 수정: 캐시 기반 텍스트 검색
- [ ] `app/api/tech/[id]/route.ts` 수정: 메타(캐시) + 블록(Notion 실시간)
- [ ] `next.config.ts` 수정: Vercel Blob URL remotePatterns 추가

---

## 10. 성공 지표

| 지표 | 목표값 | 측정 방법 |
|------|--------|----------|
| 홈 페이지 로딩 시간 (FCP) | 2초 이내 | Vercel Speed Insights |
| 기술 상세 페이지 로딩 시간 | 3초 이내 | Vercel Speed Insights |
| 모바일 레이아웃 정상 표시 | iOS Safari, Android Chrome 지원 | 직접 기기 확인 |
| 전체 기술 스택 카드 정상 렌더링 | 100% | 브라우저 직접 확인 |
| 카테고리/태그 필터 동작 정확도 | 100% | 수동 테스트 |
| LLM 분석 성공률 | BSP 연구 페이지 90% 이상 TechStack 추출 | 관리자 페이지 직접 확인 |
| 관리자 인증 보안 | JWT 미인증 시 /admin 접근 차단 | 브라우저 직접 확인 |
| PDF 다운로드 | 업로드된 파일 정상 다운로드 | 브라우저 직접 확인 |
| 차트 렌더링 | 기술 분포 차트 정상 표시 | 브라우저 직접 확인 |
| 업데이트 날짜 표기 | 분석 후 홈 페이지에 날짜 표시 | 브라우저 직접 확인 |

---

*문서 작성일: 2026-05-06 (최초 MVP)*
*최종 업데이트: 2026-05-13 (v2.0 확장 계획 반영)*
*버전: v2.0 (MVP → 프로덕션 확장)*
*프로젝트: Embedded Tech Portfolio*
