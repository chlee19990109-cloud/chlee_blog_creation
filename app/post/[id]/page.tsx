"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    Search, Bookmark, Share2, ThumbsUp, MessageSquare,
    Calendar, Clock, ArrowLeft, Check, Copy
} from "lucide-react";
import { getUserSession, getPostDetail } from "@/app/actions";
import { logout } from "@/app/login/actions";

/* ─────────────────────────────────────
   타입
───────────────────────────────────── */
interface Post {
    id: string;
    title: string;
    description: string;
    content: string | null;
    author_name: string;
    author_image: string | null;
    category: string;
    image_url: string | null;
    read_time_minutes: number;
    created_at: string;
    tags: string[];
}

interface Comment {
    id: string;
    post_id: string;
    author_name: string;
    author_image: string | null;
    content: string;
    created_at: string;
}

/* ─────────────────────────────────────
   PostDetail 컴포넌트
───────────────────────────────────── */
export default function PostDetail() {
    const params = useParams();
    const router = useRouter();
    const postId = params.id as string;

    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [bookmarked, setBookmarked] = useState(false);
    const [copied, setCopied] = useState(false);
    const [liked, setLiked] = useState(false);

    /* ── 유저 조회 ── */
    useEffect(() => {
        getUserSession().then(setUser);
    }, []);

    /* ── 게시글 + 댓글 조회 ── */
    useEffect(() => {
        if (!postId) return;

        const load = async () => {
            setIsLoading(true);
            try {
                const { post: postData, comments: commentData } = await getPostDetail(postId);
                setPost(postData);
                setComments(commentData);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [postId]);

    const handleLogout = async () => {
        await logout();
        setUser(null);
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            console.error("클립보드 복사 실패");
        }
    };

    /* ─────────────────────────────────────
       로딩 / 404 상태
    ───────────────────────────────────── */
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#111111] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-zinc-500">
                    <div className="w-8 h-8 border-2 border-zinc-700 border-t-blue-500 rounded-full animate-spin" />
                    <span className="text-sm">불러오는 중...</span>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center gap-4 text-zinc-400">
                <p className="text-2xl font-bold text-white">404</p>
                <p className="text-sm">게시글을 찾을 수 없습니다.</p>
                <Link href="/" className="text-blue-500 hover:underline text-sm">홈으로 돌아가기</Link>
            </div>
        );
    }

    /* ─────────────────────────────────────
       메인 렌더
    ───────────────────────────────────── */
    return (
        <div className="min-h-screen bg-[#111111] text-zinc-300 font-sans selection:bg-blue-500/30">

            {/* ─────── 내비게이션 ─────── */}
            <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#111111]/80 backdrop-blur-md border-b border-zinc-800">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-lg">D</div>
                        <span className="text-white font-semibold text-xl tracking-tight">DevBlog</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
                        <Link href="/" className="hover:text-white transition-colors">Articles</Link>
                        <Link href="#" className="hover:text-white transition-colors">Topics</Link>
                        <Link href="#" className="hover:text-white transition-colors">About</Link>
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-2 bg-[#1c1c1c] border border-zinc-800 rounded-lg px-3 py-2 w-72 focus-within:border-zinc-600 transition-colors">
                    <Search size={16} className="text-zinc-500 shrink-0" />
                    <input
                        type="text"
                        placeholder="글 검색..."
                        className="bg-transparent text-sm text-zinc-300 focus:outline-none w-full placeholder:text-zinc-600"
                    />
                </div>

                <div className="flex items-center gap-3 text-sm font-medium">
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
                            <Link href="/login" className="text-zinc-400 hover:text-white transition-colors px-3 py-1.5">로그인</Link>
                            <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md transition-colors shadow-sm">회원가입</Link>
                        </>
                    )}
                </div>
            </nav>

            {/* ─────── 본문 레이아웃 ─────── */}
            <main className="max-w-[740px] mx-auto px-6 py-14">

                {/* 뒤로가기 */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mb-10"
                >
                    <ArrowLeft size={16} />
                    목록으로
                </button>

                {/* ─────── 포스트 헤더 ─────── */}
                <header className="mb-10">
                    {/* 태그 뱃지들 */}
                    <div className="flex flex-wrap gap-2 mb-5">
                        <span className="px-3 py-1 text-xs font-semibold text-blue-400 bg-blue-500/10 rounded-full border border-blue-500/20">
                            {post.category}
                        </span>
                        {post.tags?.map((tag) => (
                            <span key={tag} className="px-3 py-1 text-xs font-medium text-zinc-400 bg-zinc-800/50 rounded-full border border-zinc-800">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* 제목 */}
                    <h1 className="text-4xl sm:text-[2.75rem] font-extrabold text-white leading-[1.15] tracking-tight mb-5">
                        {post.title}
                    </h1>

                    {/* 부제목(설명) */}
                    <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                        {post.description}
                    </p>

                    {/* 저자 정보 + 공유 버튼 */}
                    <div className="flex items-center justify-between py-5 border-y border-zinc-800/80">
                        {/* 저자 */}
                        <div className="flex items-center gap-3">
                            <div className="relative w-11 h-11 rounded-full overflow-hidden bg-zinc-800 shrink-0">
                                <Image
                                    src={post.author_image ?? `https://i.pravatar.cc/150?u=${post.id}`}
                                    alt={post.author_name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-zinc-100">{post.author_name}</p>
                                <div className="flex items-center gap-3 text-xs text-zinc-500 mt-0.5">
                                    <span className="flex items-center gap-1">
                                        <Calendar size={11} />
                                        {new Date(post.created_at).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={11} />
                                        {post.read_time_minutes}분 읽기
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 공유 / 북마크 버튼 */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setBookmarked((b) => !b)}
                                className={`p-2 rounded-lg border transition-colors ${bookmarked
                                    ? "border-blue-500/50 text-blue-400 bg-blue-500/10"
                                    : "border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600"
                                    }`}
                                aria-label="북마크"
                            >
                                <Bookmark size={18} fill={bookmarked ? "currentColor" : "none"} />
                            </button>
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-colors text-sm"
                                aria-label="공유"
                            >
                                {copied ? <Check size={16} className="text-green-400" /> : <Share2 size={16} />}
                                <span className={copied ? "text-green-400" : ""}>{copied ? "복사됨!" : "공유"}</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* ─────── 썸네일 이미지 ─────── */}
                <figure className="mb-12 rounded-2xl overflow-hidden border border-zinc-800">
                    <div className="relative w-full aspect-[16/9]">
                        <Image
                            src={`https://picsum.photos/seed/${post.id}/1200/675`}
                            alt={`${post.title} 썸네일`}
                            fill
                            priority
                            className="object-cover"
                        />
                    </div>
                </figure>

                {/* ─────── 본문 내용 ─────── */}
                <article className="mb-16">
                    {post.content ? (
                        <div className="space-y-5">
                            {post.content.split("\n\n").map((paragraph, i) => {
                                // 코드 블록 감지
                                if (paragraph.startsWith("```") || paragraph.includes(":") && paragraph.split("\n").length > 2) {
                                    return (
                                        <div key={i} className="my-6 rounded-xl bg-[#0f0f0f] border border-zinc-800/80 overflow-hidden">
                                            <div className="px-4 py-2.5 bg-[#161616] border-b border-zinc-800/60">
                                                <span className="text-xs text-zinc-500 font-mono">코드</span>
                                            </div>
                                            <pre className="p-4 overflow-x-auto text-sm leading-relaxed font-mono text-zinc-300 whitespace-pre-wrap">
                                                {paragraph.replace(/^```[\w]*\n?/, "").replace(/```$/, "")}
                                            </pre>
                                        </div>
                                    );
                                }
                                // 소제목 (짧고 콜론으로 끝나는 줄)
                                if (paragraph.length < 80 && !paragraph.includes(".") && paragraph.split("\n").length === 1) {
                                    return (
                                        <h2 key={i} className="text-2xl font-bold text-white mt-10 mb-2 tracking-tight">
                                            {paragraph}
                                        </h2>
                                    );
                                }
                                // 불릿 리스트
                                if (paragraph.trim().startsWith("-")) {
                                    return (
                                        <ul key={i} className="space-y-2 pl-1">
                                            {paragraph.split("\n").filter(Boolean).map((line, j) => (
                                                <li key={j} className="flex gap-2 text-zinc-300 leading-relaxed">
                                                    <span className="text-blue-500 mt-1.5 shrink-0">•</span>
                                                    <span>{line.replace(/^-\s*/, "")}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    );
                                }
                                // 일반 단락
                                return (
                                    <p key={i} className="text-zinc-300 leading-[1.85] text-[1.0625rem]">
                                        {paragraph}
                                    </p>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-zinc-400 leading-relaxed text-lg">{post.description}</p>
                    )}
                </article>

                {/* ─────── 좋아요 / 댓글 수 ─────── */}
                <div className="flex justify-center items-center gap-3 py-8 border-t border-b border-zinc-800/60 mb-14">
                    <button
                        onClick={() => setLiked((l) => !l)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all ${liked
                            ? "border-pink-500/50 text-pink-400 bg-pink-500/10"
                            : "border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                            }`}
                    >
                        <ThumbsUp size={17} fill={liked ? "currentColor" : "none"} />
                        <span className="text-sm font-medium">{liked ? "좋아요 취소" : "좋아요"}</span>
                    </button>
                    <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-800 text-zinc-500">
                        <MessageSquare size={17} />
                        <span className="text-sm font-medium">댓글 {comments.length}개</span>
                    </div>
                </div>

                {/* ─────── 댓글 섹션 ─────── */}
                <section>
                    <h2 className="text-xl font-bold text-white mb-8">
                        댓글 <span className="text-blue-500">{comments.length}</span>
                    </h2>

                    {/* 댓글 입력창 */}
                    <div className="flex gap-3 mb-10">
                        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {user?.email?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <div className="flex-grow">
                            <textarea
                                disabled={!user}
                                placeholder={user ? "댓글을 입력하세요..." : "댓글을 작성하려면 로그인하세요."}
                                className="w-full bg-[#161616] border border-zinc-800 rounded-xl p-4 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 resize-none min-h-[96px] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            />
                            {user && (
                                <div className="flex justify-end mt-2">
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
                                        게시
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 댓글 목록 */}
                    {comments.length === 0 ? (
                        <p className="text-center text-zinc-600 py-10 text-sm">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
                    ) : (
                        <div className="space-y-7">
                            {comments.map((comment) => (
                                <div key={comment.id} className="flex gap-3">
                                    <div className="relative w-9 h-9 rounded-full overflow-hidden bg-zinc-800 shrink-0">
                                        <Image
                                            src={comment.author_image ?? `https://i.pravatar.cc/150?u=${comment.id}`}
                                            alt={comment.author_name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="text-sm font-semibold text-zinc-100">{comment.author_name}</span>
                                            <span className="text-xs text-zinc-600">
                                                {new Date(comment.created_at).toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-zinc-300 leading-relaxed">{comment.content}</p>
                                        <button className="mt-2 text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
                                            좋아요
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* ─────── 푸터 ─────── */}
            <footer className="border-t border-zinc-800 bg-[#0a0a0a] py-10 mt-8">
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
