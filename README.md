# DevBlog (개발자를 위한 기술 블로그)
> **작성자: 이충환**

현대적인 웹 기술 스택인 Next.js와 Supabase를 활용하여 구축된 개인 블로그 및 게시물 공유 플랫폼입니다. 깔끔한 UI와 풍부한 텍스트 에디터, 다크 모드, 카테고리 필터 기능을 제공합니다.

🔗 **[블로그 보러가기](https://chlee-blog-creation.vercel.app/)**

---

## 🚀 기술 스택 (Tech Stack)

### 프론트엔드 (Frontend)
- **Framework**: Next.js 16.1.6 (App Router 기반) - Server Components를 통한 렌더링 최적화 및 Server Actions를 활용한 안전한 폼 데이터 처리
- **Library**: React 19.2.3, React DOM 19.2.3
- **Language**: TypeScript 5 - 정적 타입 지원으로 컴포넌트 간 데이터 모델 흐름 및 안정성 확보
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`) - PostCSS 통합을 통한 유틸리티 클래스 기반의 빠르고 일관된 반응형 뷰 설계
- **Icons**: Lucide-React - UI에 자연스럽게 녹아드는 경량화된 SVG 형태의 아이콘 팩 사용

### 백엔드 및 데이터베이스 (Backend & Database)
- **BaaS (Backend as a Service)**: Supabase (`@supabase/ssr`, `@supabase/supabase-js`) - 서버 사이드 렌더링(SSR) 환경에서의 안전한 쿠키 기반 세션 관리 로직 지원
- **Database**: PostgreSQL (Supabase 호스팅) - 관계형 데이터를 직관적으로 모델링하고 빠른 응답 속도를 보장
- **Authentication**: Supabase Auth (이메일 로그인) - 별도의 서버 구축 없이 이메일/비밀번호 데이터베이스 암호화 및 토큰 갱신 기능 통합 관리
- **Data Access Control**: RLS (Row Level Security) Policies - 클라이언트 단에서의 비정상적인 데이터 조작을 방지하기 위해 데이터베이스 계층에 테이블별 접근 권한 명시

### 배포 및 개발 환경 (Deployment & Env)
- **Deployment Platform**: Vercel - Next.js 애플리케이션에 완벽하게 최적화된 CI/CD 파이프라인을 통한 빠른 에지 네트워크 배포
- **Node Environment**: Node.js Version 20+ 권장
- **Package Manager**: npm

---

## ✨ 주요 기능 (Key Features)

### 1. 사용자 인증 (Authentication)
* **Supabase Auth**를 활용한 이메일 회원가입 및 로그인 시스템
* Next.js Server Actions와 `createClient` 유틸리티를 활용한 안전한 세션 관리

### 2. 마크다운 게시글 작성 및 렌더링 (Markdown Editor & Render)
* 외부 무거운 라이브러리 없이 구현한 간이 **마크다운 파서(Markdown Parser)** 로 HTML 변환 기능
* 굵게, 기울임꼴, 제목, 인용구, 코드 블록, 이미지 링크 삽입 등의 직관적인 에디터 툴바 지원
* 실시간 입력 양방향 바인딩 및 게시글 작성 화면 미리보기 기능

### 3. 직관적인 UI 및 탐색 환경
* Tailwind CSS를 활용한 반응형 **다크 모드** 기반 UI 디자인
* 전체 글 및 지정된 카테고리(Frontend, Backend, Terminal, Design, Database 등) 필터링
* 썸네일(Picsum Photos 랜덤 지원) 및 등록일, 읽기 소요 시간 표시
* 페이지네이션 (Pagination) 지원 및 검색바 필터링 연동

---

## 💻 로컬 개발 환경 설정 (Getting Started)
프로젝트를 로컬 환경에서 정상 구동하고 데이터베이스를 연동하기 위한 상세 가이드입니다.

### 1. 레포지토리 클론 및 패키지 설치
```bash
git clone https://github.com/chlee19990109-cloud/chlee_blog_creation.git
cd chlee_blog_creation
npm install
```

### 2. Supabase 프로젝트 초기 구성
1. **프로젝트 생성**: [Supabase](https://supabase.com/) 회원가입 후 대시보드에서 `New Project`를 생성합니다. 데이터베이스의 반응 속도를 위해 `Region` 설정 시 지연 시간이 비교적 짧은 **`Northeast Asia (Seoul)`** 을 권장합니다. 초기 비밀번호는 복사하여 잘 보관합니다.
2. **이메일 인증 옵션 해제 (로컬 테스트용)**: 가입 테스트 편의를 위해 대시보드 메뉴 사이드바의 **Authentication > Providers > Email**을 클릭하고, **Confirm Email** 활성 토글 옵션을 끄고 저장합니다.

### 3. Supabase 환경 변수 (.env.local) 등록
프로젝트 최상위 루트 디렉토리에 `.env.local` 파일을 생성합니다.
대시보드의 **Project Settings > API** 메뉴로 이동하여 `URL` 값과 `anon` (public) 키 정보를 가져와 다음과 같이 채워 넣습니다.
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url (예: https://abcdefghijklm.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Supabase 스키마 마이그레이션 (동기화)
1. **Supabase 로그인 및 프로젝트 매핑**
   로컬 터미널에서 아래 명령을 통해 브라우저 인증을 수행하고 온라인 프로젝트와 로컬 폴더를 연결합니다.
   ```bash
   npx supabase login
   npx supabase link
   ```
   (`link` 명령어 입력 시 터미널에서 위아래 방향키를 이용해 방금 만든 자신의 Supabase 프로젝트를 선택하고 `Enter`를 누릅니다.)
2. **테이블 스키마 생성 및 RLS 정책 적용**
   로컬의 `supabase/migrations/` 폴더 내에 미리 세팅된 SQL 마이그레이션 파일들을 사용자의 클라우드 DB 원격서버로 밀어 넣습니다.
   ```bash
   npx supabase db push
   ```
   이 과정으로 블로그 서비스에 필요한 `posts`, `categories`, `comments` 등의 **필수 테이블**과 함께 데이터 탈취를 막기 위한 **RLS 권한 정책**이 일괄 생성됩니다.
   > 🚫 **주의**: `npx supabase db reset` 명령어의 경우 로컬 테스트 DB용입니다. 프로덕션(운영) DB에 연결된 상태에서는 데이터가 유실되므로 절대 사용에 주의하세요.

3. **시드(Seed) 테스트용 더미 데이터 삽입**
   초기 구축 후 블로그 리스트나 카테고리를 눈으로 확인하기 위해, 프로젝트 폴더 내부의 `supabase/seed.sql` 파일 속 전체 코드(Ctrl+A)를 복사합니다. 그 후 클라우드 Supabase 대시보드의 **SQL Editor** 메뉴로 이동, 새 쿼리창에 붙여넣고 상단 **Run** 버튼을 눌러 데이터를 삽입합니다.

### 5. 통합 및 개발 서버 활성화
```bash
npm run dev
```
이제 개발 서버 구동이 완료되었습니다!
브라우저 주소창에 [http://localhost:3000](http://localhost:3000)을 입력 후 접속합니다. 메인 화면 출력 및 회원가입 테스트 후, `/write` 경로의 글 작성이 정상적으로 처리되는지 확인하면 됩니다.

---

## 🌐 배포 가이드 (Deployment)
이 프로젝트는 **Vercel** 배포에 최적화된 Next.js 프로젝트입니다.

1. Vercel 플랫폼에 접속하여 해당 GitHub 레포지토리를 가져옵니다(Import).
2. 배포 설정 단계 중 **Environment Variables** 탭에 로컬 `.env.local`에 작성했던 `NEXT_PUBLIC_SUPABASE_URL`와 `NEXT_PUBLIC_SUPABASE_ANON_KEY`를 등록합니다.
3. Deploy 버튼을 눌러 빌드를 완료합니다.

> ⚠️ **중요 확인 사항**
> Vercel에서 제공한 배포 도메인(예: `https://chlee-blog-creation.vercel.app/`)을 복사한 뒤,
> **Supabase Dashboard > Authentication > URL Configuration > Site URL 및 Redirect URLs**에 꼭 추가해주세요. 이 단계가 누락되면 배포 환경에서 로그인이 정상적으로 작동하지 않습니다.
