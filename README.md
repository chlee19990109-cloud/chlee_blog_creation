# DevBlog (개발자를 위한 기술 블로그)
> **write. chlee**

현대적인 웹 기술 스택인 Next.js와 Supabase를 활용하여 구축된 개인 블로그 및 게시물 공유 플랫폼입니다. 깔끔한 UI와 풍부한 텍스트 에디터, 다크 모드, 북마크 기능을 제공합니다.

🔗 **[Live Demo 보러가기](https://chlee-blog-creation.vercel.app/)**

---

## 🚀 기술 스택 (Tech Stack)
- **Framework**: Next.js 14 (App Router, Server/Client Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend / Database**: Supabase (PostgreSQL, Auth, RLS Policies)
- **Deployment**: Vercel
- **Markdown Processor**: Custom React Markdown Parser

## ✨ 주요 기능 (Key Features)

### 사용자 인증 (Authentication)
* Supabase Auth를 활용한 안전한 이메일 회원가입 및 로그인 시스템

### 풀스택 마크다운 에디터 (Markdown Editor)
* 코딩 블록구문 강조(Syntax Highlighting) 및 실시간 미리보기가 지원되는 에디터
* 글 발행 상태 관리: 임시저장(Draft) / 공개(Published) 기능

### 블로그 읽기 경험 최적화
* 다크 모드 기반의 깔끔하고 현대적인 UI 설계
* 각 페이지별 읽기 소요 시간(Read Time) 자동 표시 기능
* 카테고리 필터링 및 제목 검색 기반 페이지네이션 지원

### 마이 페이지 & 공유 기능
* 게시물 상세 페이지에서 직접 '북마크 토글' 기능 제공
* 빠르고 쉬운 'URL 클립보드 복사(공유)' 기능 제공
* 동적 썸네일 자동 생성 및 연결 기능

---

## 💻 로컬 개발 환경 설정 (Getting Started)
프로젝트를 로컬 환경에서 실행하려면 다음 단계를 따르세요.

### 1. 레포지토리 클론
```bash
git clone https://github.com/chlee19990109-cloud/chlee_blog_creation.git
cd chlee_blog_creation
```

### 2. 패키지 설치
```bash
npm install
```

### 3. 환경 변수 설정
루트 디렉토리에 `.env.local` 파일을 생성하고, 본인의 Supabase 프로젝트 정보를 입력합니다.
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 [http://localhost:3000](http://localhost:3000) (또는 설정한 로컬 도메인)에 접속하여 블로그를 확인합니다.

---

## 🛠️ Supabase 데이터베이스 세팅 가이드
Supabase 클라우드를 처음 설정할 경우 프로젝트의 `supabase/` 폴더 내에 있는 SQL 파일들을 순차적으로 실행하여 테이블, RLS 권한, 함수 등을 생성해야 합니다. 또는, Supabase CLI를 통해 아래 명령어로 한 번에 마이그레이션을 적용할 수 있습니다.

```bash
npx supabase db push
```

---

## 🌐 배포 가이드 (Deployment)
이 프로젝트는 Vercel에 최적화되어 있습니다.

1. Vercel에 GitHub 레포지토리를 연결(Import)합니다.
2. Vercel 프로젝트 **Settings > Environment Variables** 항목에 `NEXT_PUBLIC_SUPABASE_URL` 및 `NEXT_PUBLIC_SUPABASE_ANON_KEY`를 추가합니다.
3. 배포(Deploy) 버튼을 누릅니다.

> ⚠️ **(중요)** 발급받은 배포 후 도메인(예: `https://chlee-blog-creation.vercel.app/`)을 **Supabase Dashboard의 Authentication > URL Configuration** 에 추가하여 로그인 리다이렉트를 허용해주어야 정상적인 인증이 가능합니다.
