---
name: 기술 스택 특이사항
description: @notionhq/client v5 API 변경, Next.js 16 revalidate export, ESLint 규칙 등 비표준 동작 메모
type: project
---

## @notionhq/client v5 (현재 설치: ^5.20.0)

훈련 데이터의 Notion SDK와 API가 다릅니다:

- `notion.databases.query()` → **`notion.dataSources.query()`** 로 변경
- 파라미터도 `database_id` → **`data_source_id`** 로 변경
- `notion.blocks.children.list()` — 동일
- `notion.pages.retrieve()` — 동일
- 타입 임포트: `@notionhq/client/build/src/api-endpoints` 대신 **`@notionhq/client`** 에서 직접 임포트

## Next.js 16 route segment config

- `export const revalidate = N` — 여전히 유효 (cacheComponents 미사용 시)
- 단, 값은 **정적 리터럴**이어야 함. 변수 참조 불가 (`revalidate = CONSTANT` 빌드 오류)
- `export const revalidate = 60` 형태로만 사용

## ESLint 규칙 (이 프로젝트 엄격 설정)

- `react-hooks/set-state-in-effect`: useEffect 내부에서 setState() 직접 호출 금지
  - 해결: useState 지연 초기화(`useState(() => ...)`) 사용
  - 해결: useEffect에서 외부 구독 callback으로 setState 호출 (직접 호출 아님)
- `react-hooks/refs`: render 중 ref.current 쓰기 금지

## Turbopack 워크스페이스 경고

상위 디렉토리에 package-lock.json이 있어 워크스페이스 루트 오탐 경고 발생. 
무시해도 빌드는 성공. `next.config.ts`의 `turbopack.root` 설정으로 제거 가능.

**Why:** 2026-05-07 기준 실제 빌드 및 런타임에서 발견한 내용

**How to apply:** Notion API 코드 작성 시 항상 dataSources.query() 사용. revalidate는 리터럴 숫자만.
