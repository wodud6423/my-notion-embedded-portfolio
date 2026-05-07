# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## 프로젝트 개요

임베디드 시스템 개발자의 기술 역량을 Notion CMS 기반으로 전달하는 포트폴리오 웹사이트. Next.js App Router + React 19 기반.

# Project Context
- PRD 문서: @docs/PRD.md
- 개발 로드맵: @docs/ROADMAP.md

## 개발 명령어

```bash
npm run dev      # 개발 서버 시작
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 실행
```

테스트 설정 없음. 브라우저에서 직접 확인 필요.

## 환경변수 설정

`.env.local` 파일 생성 후 `.env.example` 참고하여 값 입력:
- `NOTION_TOKEN`: Notion Integration Token
- `NOTION_DATABASE_ID`: 기술 스택 데이터베이스 ID
- `NEXT_PUBLIC_BASE_URL`: 배포 도메인 (로컬: `http://localhost:3000`)

## 아키텍처

**App Router 구조:**
- `app/` — Next.js App Router 페이지 (layout.tsx, page.tsx, not-found.tsx, error.tsx)
- `app/category/[category]/` — 카테고리별 기술 목록 페이지 (Kernel, Driver, RTOS, Yocto)
- `app/tech/[id]/` — 기술 상세 페이지 (개념 + 구현 경험 + 트러블슈팅)
- `app/search/` — 검색 결과 페이지
- `app/api/tech/` — 기술 목록 Route Handler
- `app/api/tech/[id]/` — 기술 상세 Route Handler
- `app/api/tech/search/` — 검색 Route Handler
- `components/ui/` — shadcn/ui 컴포넌트 (badge, button, card, dialog, input 등)
- `components/layout/` — 레이아웃 컴포넌트 (header, footer, mobile-menu, nav-links, theme-toggle)
- `components/providers/` — ThemeProvider (라이트/다크/시스템 테마)
- `components/tech/` — 기술 스택 관련 컴포넌트 (tech-card)
- `hooks/` — 커스텀 훅 (use-debounce, use-local-storage, use-media-query, use-toast)
- `lib/` — 유틸리티 및 서버 로직
  - `utils.ts` — cn() 유틸리티
  - `constants.ts` — 사이트 설정, 카테고리, 난이도 상수
  - `notion.ts` — Notion 클라이언트 싱글턴
  - `tech-mapper.ts` — Notion API 응답 → TechStack 타입 변환
  - `block-parser.ts` — Notion 블록 섹션 분리 파싱
- `store/` — Zustand 스토어 (filter-store: 카테고리/태그/난이도/검색 상태)
- `types/` — TypeScript 타입 정의 (TechStack, TechCategory, Difficulty 등)

**Notion 데이터베이스 프로퍼티 (필수):**
- `Title` (Title): 기술 이름
- `Category` (Select): Kernel | Driver | RTOS | Yocto | Other
- `Tags` (Multi-select): GPIO, UART, I2C 등
- `Summary` (Rich text): 한 줄 요약
- `Difficulty` (Select): Beginner | Intermediate | Advanced
- `Importance` (Number): 중요도 1~5
- `Created` (Created time): 자동 생성

**스타일링:**
- Tailwind CSS v4 (postcss 방식, `tailwind.config.*` 없음)
- CSS 커스텀 속성 기반 디자인 토큰은 `app/globals.css`에 정의
- shadcn/ui style: `radix-nova`, oklch 색상 시스템

**컴포넌트 추가:**
- shadcn/ui 컴포넌트 추가: `npx shadcn@latest add <component>`
- `components.json`에서 경로 alias 및 스타일 설정 관리

**ISR 캐싱:**
- 모든 페이지 및 API Route에 `revalidate = 60` 적용 (60초 재검증)
- Notion API 호출은 서버 컴포넌트 또는 Route Handler에서만 실행

## 경로 Alias

`@/*` → 프로젝트 루트 기준 절대 경로
