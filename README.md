# Claude Next.js Starters

Next.js 16 + React 19 기반 모던 웹 스타터킷. shadcn/ui 컴포넌트와 다크모드, 반응형 레이아웃, 커스텀 훅을 포함한 템플릿 프로젝트.

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router), React 19 |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS v4 |
| UI 컴포넌트 | shadcn/ui (radix-nova) |
| 아이콘 | lucide-react |

## 시작하기

### 필수 요구사항

- Node.js 18 이상
- npm / yarn / pnpm

### 설치

```bash
git clone <저장소 URL>
cd claude-nextjs-starters
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인한다.

## 프로젝트 구조

```
├── app/
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 홈 페이지
│   ├── globals.css         # 전역 스타일 및 디자인 토큰
│   └── showcase/           # UI 컴포넌트 갤러리
├── components/
│   ├── ui/                 # shadcn/ui 컴포넌트
│   ├── layout/             # 레이아웃 컴포넌트 (header, footer 등)
│   └── providers/          # ThemeProvider
├── hooks/                  # 커스텀 훅
│   ├── use-debounce.ts
│   ├── use-local-storage.ts
│   ├── use-media-query.ts
│   └── use-toast.ts
└── lib/                    # 유틸리티 및 상수
    ├── utils.ts
    └── constants.ts
```

## 주요 명령어

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 시작 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run lint` | 코드 린트 |

## 컴포넌트 추가

shadcn/ui 컴포넌트를 추가하려면:

```bash
npx shadcn@latest add <component>
```
