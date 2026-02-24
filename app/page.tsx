"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight, PenSquare } from "lucide-react";
import { getUserSession, getPosts } from "@/app/actions";
import { logout } from "@/app/login/actions";

/* ─────────────────────────────────────
   타입
───────────────────────────────────── */
interface Post {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string | null;
  read_time_minutes: number;
  created_at: string;
  tags: string[];
}

/* ─────────────────────────────────────
   상수
───────────────────────────────────── */
const CATEGORIES = ["전체 글", "Frontend", "Backend", "Terminal", "Design", "Database"];
const POSTS_PER_PAGE = 6;

/* ─────────────────────────────────────
   Home 컴포넌트
───────────────────────────────────── */
export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("전체 글");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  /* ── 유저 조회 ── */
  useEffect(() => {
    getUserSession().then(setUser);
  }, []);

  /* ── 게시글 조회 ── */
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const { data, count } = await getPosts({
          category: activeCategory,
          searchQuery,
          page: currentPage,
          postsPerPage: POSTS_PER_PAGE,
        });
        setPosts(data);
        setTotalCount(count);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [activeCategory, currentPage, searchQuery]);

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  /* ─────────────────────────────────────
     렌더
  ───────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#111111] text-zinc-300 font-sans selection:bg-blue-500/30">

      {/* ─────── 내비게이션 ─────── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#111111]/80 backdrop-blur-md border-b border-zinc-800">
        {/* 왼쪽: 로고 + 메뉴 */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-lg">
              D
            </div>
            <span className="text-white font-semibold text-xl tracking-tight">DevBlog</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <Link href="#" className="hover:text-white transition-colors">Articles</Link>
            <Link href="#" className="hover:text-white transition-colors">Topics</Link>
            <Link href="#" className="hover:text-white transition-colors">About</Link>
          </div>
        </div>

        {/* 가운데: 검색창 */}
        <div className="hidden lg:flex items-center gap-2 bg-[#1c1c1c] border border-zinc-800 rounded-lg px-3 py-2 w-72 focus-within:border-zinc-600 transition-colors">
          <Search size={16} className="text-zinc-500 shrink-0" />
          <input
            type="text"
            placeholder="글 검색..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="bg-transparent text-sm text-zinc-300 focus:outline-none w-full placeholder:text-zinc-600"
          />
        </div>

        {/* 오른쪽: 글쓰기 + 로그인/로그아웃 */}
        <div className="flex items-center gap-3 text-sm font-medium">
          <Link
            href="/write"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-zinc-700 text-zinc-300 hover:border-blue-500 hover:text-blue-400 transition-colors"
          >
            <PenSquare size={14} />
            글쓰기
          </Link>
          {user ? (
            <>
              <span className="text-zinc-400 hidden sm:block text-xs truncate max-w-[140px]">{user.email}</span>
              <button
                onClick={handleLogout}
                className="text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-md border border-zinc-800 hover:border-zinc-600"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-zinc-400 hover:text-white transition-colors px-3 py-1.5">
                로그인
              </Link>
              <Link
                href="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md transition-colors shadow-sm"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ─────── 히어로 섹션 ─────── */}
      <section className="py-24 text-center relative overflow-hidden">
        {/* 배경 글로우 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
            모던 웹을 위한<br />엔지니어링 인사이트
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed max-w-xl mx-auto">
            시스템 설계, 프론트엔드 아키텍처, 개발자 생산성에 대한 심층 분석.
            엄선된 기술 아티클로 한발 앞서가세요.
          </p>
        </div>
      </section>

      {/* ─────── 카테고리 필터 ─────── */}
      <div className="flex justify-center gap-2 flex-wrap px-6 pb-12">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${activeCategory === cat
              ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20"
              : "bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ─────── 게시글 리스트 ─────── */}
      <main className="max-w-6xl mx-auto px-6 pb-20">
        {isLoading ? (
          /* 로딩 스켈레톤 */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-[#161616] border border-zinc-800 overflow-hidden animate-pulse">
                <div className="h-48 bg-zinc-800" />
                <div className="p-6 space-y-3">
                  <div className="h-3 bg-zinc-800 rounded w-1/3" />
                  <div className="h-5 bg-zinc-800 rounded w-4/5" />
                  <div className="h-3 bg-zinc-800 rounded w-full" />
                  <div className="h-3 bg-zinc-800 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 text-zinc-500">
            <p className="text-lg">게시글이 없습니다.</p>
            <p className="text-sm mt-2">다른 카테고리를 선택해 보세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                href={`/post/${post.id}`}
                key={post.id}
                className="group flex flex-col bg-[#161616] rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                {/* 썸네일 */}
                <div className="relative h-48 w-full bg-zinc-900 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                  <span className="absolute top-3 left-3 z-20 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded border border-zinc-700">
                    {post.category}
                  </span>
                  <Image
                    src={`https://picsum.photos/seed/${post.id}/600/400`}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* 본문 */}
                <div className="flex flex-col flex-grow p-5">
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
                    <span>
                      {new Date(post.created_at).toLocaleDateString("ko-KR", {
                        year: "numeric", month: "short", day: "numeric",
                      })}
                    </span>
                    <span>•</span>
                    <span>{post.read_time_minutes}분 읽기</span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-2">
                    {post.description}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-1.5">
                    {post.tags?.map((tag) => (
                      <span key={tag} className="text-xs text-blue-400/80 bg-blue-500/10 px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ─────── 페이지네이션 ─────── */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-14">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 rounded-md text-sm border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
              이전
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-md text-sm font-medium transition-colors ${currentPage === page
                  ? "bg-blue-600 text-white"
                  : "border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white"
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 rounded-md text-sm border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              다음
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </main>

      {/* ─────── 푸터 ─────── */}
      <footer className="border-t border-zinc-800 bg-[#0a0a0a] py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-bold">D</div>
            <span className="text-white font-semibold tracking-tight">DevBlog</span>
          </div>

          <nav className="flex gap-6 text-sm text-zinc-500">
            <Link href="#" className="hover:text-white transition-colors">About</Link>
            <Link href="#" className="hover:text-white transition-colors">Newsletter</Link>
            <Link href="#" className="hover:text-white transition-colors">RSS</Link>
          </nav>

          <p className="text-sm text-zinc-600">© 2023 DevBlog Inc.</p>
        </div>
      </footer>
    </div>
  );
}
