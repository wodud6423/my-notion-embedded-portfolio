---
name: 프로젝트 목적
description: embedded-portfolio는 임베디드 시스템 개발자의 기술 역량을 Notion CMS로 전달하는 포트폴리오 웹사이트
type: project
---

이 프로젝트는 임베디드 기술 포트폴리오 웹사이트입니다. 스타터킷 템플릿에서 출발했지만, 실제 목적은 Notion 데이터베이스 기반 기술 스택 전시입니다.

**Why:** docs/PRD.md에 상세한 요구사항이 정의되어 있습니다. Notion을 단일 CMS로 사용하며, 별도 배포 없이 Notion 편집만으로 콘텐츠가 자동 반영됩니다.

**How to apply:** 새 기능 추가 시 항상 PRD.md의 기능 요구사항(F001~F012)을 참고하세요. MVP 이후 기능(댓글, 통계, 다국어 등)은 현재 범위 밖입니다.

**주요 라우트:**
- `/` — 홈 (카테고리 카드 목록)
- `/category/[category]` — 카테고리별 기술 목록 (Kernel, Driver, RTOS, Yocto)
- `/tech/[id]` — 기술 상세 (개념, 구현 경험, 트러블슈팅)
- `/search?q=` — 키워드 검색
- `/api/tech`, `/api/tech/[id]`, `/api/tech/search` — Notion API Route Handler
