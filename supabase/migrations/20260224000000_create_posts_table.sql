-- =============================================
-- Blog 플랫폼 데이터베이스 마이그레이션
-- 생성일: 2026-02-24
-- =============================================

-- 1. categories 테이블 생성
CREATE TABLE IF NOT EXISTS public.categories (
  id   UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- 2. posts 테이블 생성
CREATE TABLE IF NOT EXISTS public.posts (
  id                 UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title              TEXT        NOT NULL,
  description        TEXT        NOT NULL,
  content            TEXT,
  author_name        TEXT        NOT NULL DEFAULT 'Anonymous',
  author_image       TEXT,
  category           TEXT        NOT NULL,
  image_url          TEXT,
  read_time_minutes  INTEGER     NOT NULL DEFAULT 5,
  tags               TEXT[]      DEFAULT '{}'::TEXT[],
  created_at         TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

-- 3. comments 테이블 생성
CREATE TABLE IF NOT EXISTS public.comments (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id      UUID        REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  author_name  TEXT        NOT NULL,
  author_image TEXT,
  content      TEXT        NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

-- =============================================
-- RLS (Row Level Security) 활성화
-- =============================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments   ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 공개 읽기 정책
-- =============================================
CREATE POLICY "누구나 카테고리를 조회할 수 있습니다."
  ON public.categories FOR SELECT USING (true);

CREATE POLICY "누구나 게시글을 조회할 수 있습니다."
  ON public.posts FOR SELECT USING (true);

CREATE POLICY "누구나 댓글을 조회할 수 있습니다."
  ON public.comments FOR SELECT USING (true);
