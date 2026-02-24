-- =============================================
-- 게시글(posts) 작성 권한 RLS 정책 추가
-- 생성일: 2026-02-24
-- 설명: 로그인한 사용자(authenticated)만 posts 테이블에 데이터를 INSERT 할 수 있습니다.
-- =============================================

-- posts 테이블 RLS 활성화 확인 (안전장치)
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 기존 정책이 있다면 삭제 후 재생성 (충돌 방지)
DROP POLICY IF EXISTS "로그인한 유저는 게시글을 작성할 수 있습니다." ON public.posts;

-- 새 정책 추가: role이 'authenticated'인 경우만 INSERT 허용
CREATE POLICY "로그인한 유저는 게시글을 작성할 수 있습니다."
  ON public.posts
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
