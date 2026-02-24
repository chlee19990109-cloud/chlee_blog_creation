# Supabase 설정 및 마이그레이션 실행 가이드

이 문서에서는 Supabase 데이터베이스 테이블을 생성하고, 초기 시드 데이터를 넣는 방법을 안내합니다.
`.env.local` 에 이미 Supabase 환경 변수가 설정되어 있다는 전제 하에 아래 과정을 진행합니다.

## 방법 1: Supabase CLI를 이용한 로컬/원격 마이그레이션 적용

1. 터미널에서 다음 명령어를 실행하여 Supabase 프로젝트에 로그인합니다.
   ```bash
   npx supabase login
   ```
2. Supabase 프로젝트와 연결합니다. (미연결 시)
   ```bash
   npx supabase link --project-ref <your-project-ref>
   ```
   *참고: `<your-project-ref>`는 Supabase 대시보드의 Project Settings > General에서 찾을 수 있습니다.*

3. 마이그레이션 스크립트를 데이터베이스에 푸시하여 테이블과 RLS 설정을 적용합니다.
   ```bash
   npx supabase db push
   ```

## 방법 2: Supabase Studio(대시보드)의 SQL Editor를 통한 직접 실행

CLI를 사용하지 않고 직접 적용하려면 다음 스크립트의 내용을 Supabase 대시보드의 [SQL Editor] 메뉴에 복사하여 각각 실행하세요.

1. **테이블 생성 및 RLS 적용**
   `supabase/migrations/20260224000000_create_posts_table.sql` 파일의 내용을 복사하여 실행합니다.
2. **시드 데이터 삽입**
   `supabase/seed.sql` 파일의 내용을 복사하여 실행합니다.

---

> **참고**: 시드 데이터에 있는 `image_url` 경로 이미지(예: `/react-concurrency.jpg` 등)는 나중에 `public` 폴더에 이미지를 추가하거나, 외부 URL로 교체해주어야 웹페이지에서 이미지가 정상 출력됩니다.
