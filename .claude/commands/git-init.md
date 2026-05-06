# /git-init

현재 디렉토리를 git 저장소로 초기화하고, 프로젝트를 분석하여 한국어 README.md를 생성한 뒤 첫 커밋을 만든다.

`$ARGUMENTS`를 프로젝트 이름 힌트로 사용할 수 있다 (예: `/git-init my-app`).

---

## 실행 절차

### 1단계 — git 상태 확인

`git status`를 실행해 현재 상태를 파악한다.

- **이미 git 저장소면** (`.git/` 존재): 아래 메시지를 출력하고 사용자에게 계속 진행할지 확인한다.

  ```
  이미 git 저장소입니다. (git log 확인: N개 커밋 존재)
  계속 진행하면 README.md만 새로 생성하고 커밋합니다.
  계속할까요? (y/n)
  ```

  - **n** → 종료한다.
  - **y** → 3단계로 건너뛴다.

- **git 저장소가 아니면** → 2단계로 이동한다.

---

### 2단계 — git init 실행

```bash
git init
```

성공 메시지를 확인하고, 다음 단계로 이동한다.

---

### 3단계 — 프로젝트 분석

아래 파일과 디렉토리를 읽어 프로젝트의 특징을 파악한다. **파일이 없으면 건너뛴다.**

#### 읽어야 할 항목 (우선순위 순)

1. `package.json` — 프로젝트 이름, 버전, 스크립트, 주요 의존성
2. `CLAUDE.md` / `AGENTS.md` — 이미 정리된 아키텍처 설명
3. `tsconfig.json` — TypeScript 설정 및 경로 alias
4. `next.config.*` / `vite.config.*` / `*.config.*` — 프레임워크 설정
5. `app/` 또는 `src/` 디렉토리 구조 — 주요 파일 목록 (glob으로 depth 2까지)
6. `components/` 디렉토리 구조 — 컴포넌트 분류 파악
7. `README.md` (기존 파일) — 이미 있는 내용 참고 (덮어쓰기 전 확인)

#### 분석 결과로 파악해야 할 항목

- **프레임워크**: Next.js / Vite / CRA / 기타
- **언어**: TypeScript / JavaScript
- **주요 라이브러리**: UI 라이브러리, 상태관리, 폼, 스타일링
- **프로젝트 목적**: package.json `name`과 `description` 기준
- **실행 명령어**: scripts 항목
- **디렉토리 구조**: 실제 존재하는 경로 기준으로 정리
- **환경 변수**: `.env.example` 또는 `.env.local.example` 존재 여부

---

### 4단계 — README.md 초안 생성

분석 결과를 바탕으로 아래 구조의 **한국어** README.md 초안을 작성한다.

**README.md 구조:**

```markdown
# <프로젝트명>

<한 문장 설명 — package.json description 또는 CLAUDE.md 기반>

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | ... |
| 언어 | ... |
| 스타일링 | ... |
| UI 컴포넌트 | ... |
| 상태관리 | ... |  ← 해당 시만
| 폼 | ... |          ← 해당 시만

## 시작하기

### 필수 요구사항

- Node.js 18 이상
- npm / yarn / pnpm

### 설치

```bash
git clone <저장소 URL>
cd <프로젝트명>
npm install
```

### 환경 변수 설정  ← .env.example이 있을 때만 포함

`.env.example`을 복사하여 `.env.local`을 생성하고 값을 채운다.

```bash
cp .env.example .env.local
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인한다.

## 프로젝트 구조

```
<실제 디렉토리 구조를 tree 형식으로>
```

## 주요 명령어

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 시작 |
| `npm run build` | 프로덕션 빌드 |
| `npm run lint` | 코드 린트 |
| ...   | ...  |

## 라이선스

MIT  ← package.json license 필드 기준, 없으면 생략
```

> 실제 존재하지 않는 섹션(환경 변수, 라이선스 등)은 포함하지 않는다.
> `$ARGUMENTS`가 있으면 프로젝트명 힌트로 활용한다.

---

### 5단계 — README.md 확인 및 저장

초안을 출력한 뒤 사용자에게 확인을 요청한다:

```
README.md 초안입니다. 위 내용으로 저장할까요?
  1) 저장 (그대로 사용)
  2) 수정 후 저장 (변경할 내용을 알려주세요)
  3) 취소 (README.md 생성 건너뜀)
```

- **1 선택** → README.md를 저장하고 6단계로 이동한다.
- **2 선택** → 사용자가 알려준 내용을 반영하여 초안을 다시 출력하고 5단계를 반복한다.
- **3 선택** → README.md 저장을 건너뛰고 6단계로 이동한다.

---

### 6단계 — .gitignore 확인

`.gitignore` 파일이 없으면 사용자에게 생성 여부를 묻는다:

```
.gitignore 파일이 없습니다. 기본 .gitignore를 생성할까요? (y/n)
```

- **y** → 아래 내용으로 `.gitignore`를 생성한다:

  ```
  # 의존성
  node_modules/
  .pnp
  .pnp.js

  # 빌드 결과물
  .next/
  out/
  dist/
  build/

  # 환경 변수
  .env
  .env.local
  .env.development.local
  .env.test.local
  .env.production.local

  # 로그
  npm-debug.log*
  yarn-debug.log*
  yarn-error.log*

  # 에디터
  .DS_Store
  .vscode/
  .idea/
  *.swp
  *.swo

  # 타입스크립트
  *.tsbuildinfo
  next-env.d.ts
  ```

- **n** → 건너뛴다.
- **파일이 이미 존재하면** → 이 단계를 건너뛴다.

---

### 7단계 — 첫 커밋

모든 파일을 stage하고 첫 커밋을 만든다.

#### 7-1. stage 대상 확인

`git status`로 untracked/modified 파일을 확인한다.

커밋 대상 파일 목록을 출력한다:

```
첫 커밋에 포함될 파일:
  - README.md
  - .gitignore
  - package.json
  - ... (전체 목록)

총 N개 파일
```

#### 7-2. 커밋 실행 확인

```
위 파일을 모두 포함하여 첫 커밋을 만들까요?
  1) 확인
  2) 취소
```

- **2 선택** → 종료한다.

#### 7-3. git add 및 커밋 실행

```bash
git add .
git commit -m "chore: 프로젝트 초기 설정"
```

커밋 메시지는 `$ARGUMENTS`가 있으면 `chore: <$ARGUMENTS> 초기 설정` 형식으로 조정한다.

---

### 8단계 — 완료 요약

```
✓ git 초기화 완료!

  저장소 경로: <현재 디렉토리>
  첫 커밋: chore: 프로젝트 초기 설정
  커밋 해시: <hash>
  포함 파일: N개

다음 단계:
- 원격 저장소를 연결하려면:
    git remote add origin <저장소 URL>
    git push -u origin main
- 개발을 시작하려면: npm run dev
```
