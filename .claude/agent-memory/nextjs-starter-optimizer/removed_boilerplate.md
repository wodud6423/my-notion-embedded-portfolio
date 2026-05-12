---
name: 제거된 데모 코드
description: 스타터킷 템플릿 코드 중 포트폴리오 목적과 맞지 않아 제거/교체한 항목 목록
type: project
---

## 제거된 파일

- `app/showcase/` 전체 디렉토리 — shadcn/ui 컴포넌트 갤러리 (스타터킷 데모 전용)
- `public/next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg` — Next.js 기본 SVG

## 교체된 파일

- `app/page.tsx` — "모던 웹 스타터킷" 소개 → 임베디드 포트폴리오 랜딩 (카테고리 카드 그리드)
- `lib/constants.ts` — navItems에 Showcase 제거, 카테고리(Kernel/Driver/RTOS/Yocto) 추가
- `app/layout.tsx` — 메타데이터 "Modern Starter" → "Embedded Portfolio"

## 추가된 파일

- `lib/notion.ts` — Notion 클라이언트 싱글턴
- `lib/tech-mapper.ts` — Notion API 응답 → TechStack 타입 변환
- `lib/block-parser.ts` — Notion 블록 H2 섹션 분리 파싱
- `store/filter-store.ts` — Zustand 필터 상태 (카테고리/태그/난이도/검색)
- `components/tech/tech-card.tsx` — 기술 스택 카드 컴포넌트
- `app/category/[category]/page.tsx` — 카테고리 페이지 (ISR)
- `app/tech/[id]/page.tsx` — 기술 상세 페이지
- `app/search/page.tsx` — 검색 결과 페이지
- `app/not-found.tsx` — 404 페이지
- `app/error.tsx` — 런타임 오류 페이지
- `app/api/tech/route.ts` — 기술 목록 API
- `app/api/tech/[id]/route.ts` — 기술 상세 API
- `app/api/tech/search/route.ts` — 검색 API
- `.env.example` — 환경변수 템플릿
- `types/index.ts` — TechStack, TechCategory, Difficulty 등 포트폴리오 타입 추가
