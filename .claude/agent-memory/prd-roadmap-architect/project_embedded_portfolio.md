---
name: embedded-portfolio 프로젝트 현황
description: Notion CMS 기반 임베디드 포트폴리오 — Phase별 구현 상태 및 잔여 작업
type: project
---

2026-05-12 기준 전체 5개 Phase 중 Phase 1~2 완료, Phase 3 ~80%, Phase 4 ~33% (전체 약 70%).

**완료된 핵심 모듈:**
- lib/notion.ts, lib/tech-mapper.ts, lib/block-parser.ts — Notion 연동 계층 완성
- types/index.ts — 9개 인터페이스 (TechStack, TechStackDetail, NotionBlock 등)
- /api/tech, /api/tech/[id], /api/tech/search Route Handler 완성
- store/filter-store.ts — Zustand 필터 스토어 완성
- components/tech/tech-card.tsx — 기술 카드 컴포넌트 완성
- components/tech/tech-grid.tsx — TechGrid 컴포넌트 완성 (반응형 그리드, Empty State)
- components/tech/home-tech-list.tsx — HomeTechList 클라이언트 컴포넌트 완성 (Zustand 구독, 필터 API 재요청)
- app/page.tsx — 홈 페이지 Notion 실제 데이터 연동 완료 (async 서버 컴포넌트, revalidate=60)
- shiki 패키지 설치 완료 (CodeBlock 구현을 위한 사전 작업)
- app/category/[category]/page.tsx — TechGrid 리팩터링 완료
- app/search/page.tsx — TechGrid 교체 완료 (hasNoResult 변수로 조건 통합)

**핵심 잔여 작업:**
- components/tech/notion-renderer/ — NotionBlockRenderer + 기본 블록 컴포넌트 8개 (Paragraph, Heading, BulletedList, NumberedList, Quote, Divider, Unsupported, Callout, CodeBlock)
- app/tech/[id]/page.tsx — 플레이스홀더 제거, NotionBlockRenderer 실제 연결
- components/tech/filter-bar.tsx — 필터 UI와 Zustand 스토어 연결 (Phase 4)
- components/layout/search-input.tsx + app/search/page.tsx API 연결 (Phase 4)
- ISR 설정 — /api/tech/* Route Handler에 force-dynamic 제거, revalidate=60 전환 (Phase 5)
- 로딩 스켈레톤 UI, Vercel 배포 (Phase 5)

**Why:** 포트폴리오 사이트이며 Notion이 단일 CMS. 서버 컴포넌트 우선, ISR 60초 캐싱 전략.

**How to apply:** 코드 하이라이팅은 shiki로 결정됨. Phase 3(블록 렌더러 완성)이 다음 최우선 작업. shrimp 태스크 완료 시 ROADMAP.md도 반드시 동기화해야 함.
