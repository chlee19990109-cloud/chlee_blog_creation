"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    Bold, Italic, Type, Link2, ImageIcon, Quote, Code2,
    List, ListOrdered, Eye, Columns2, Save, Upload,
    ChevronDown, X
} from "lucide-react";
import { getUserSession, publishPost } from "@/app/actions";

/* ─────────────────────────────────────
   타입
───────────────────────────────────── */
interface FormData {
    title: string;
    description: string;
    content: string;
    category: string;
    tags: string;
    read_time_minutes: number;
}

/* ─────────────────────────────────────
   마크다운 → HTML 간이 변환 (외부 라이브러리 없음)
───────────────────────────────────── */
function parseMarkdown(md: string): string {
    return md
        // 코드 블록
        .replace(/```([\s\S]*?)```/g, '<pre class="bg-[#0f0f0f] border border-zinc-800 rounded-xl p-4 my-4 overflow-x-auto text-sm font-mono text-zinc-300 whitespace-pre-wrap"><code>$1</code></pre>')
        // H1
        .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-extrabold text-white mt-8 mb-4">$1</h1>')
        // H2
        .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-white mt-6 mb-3">$1</h2>')
        // H3
        .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold text-white mt-5 mb-2">$1</h3>')
        // 볼드
        .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
        // 이탤릭
        .replace(/\*(.+?)\*/g, '<em class="italic text-zinc-200">$1</em>')
        // 인라인 코드
        .replace(/`(.+?)`/g, '<code class="bg-[#1c1c1c] text-blue-300 px-1.5 py-0.5 rounded text-sm font-mono border border-zinc-800">$1</code>')
        // 인용구
        .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-blue-500 pl-5 py-1 my-4 bg-blue-500/5 rounded-r-lg italic text-zinc-300">$1</blockquote>')
        // 링크
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-blue-400 underline hover:text-blue-300" target="_blank">$1</a>')
        // 비순서 리스트
        .replace(/^- (.+)$/gm, '<li class="flex gap-2 text-zinc-300 my-1"><span class="text-blue-500 mt-1">•</span><span>$1</span></li>')
        // 순서 리스트
        .replace(/^\d+\. (.+)$/gm, '<li class="text-zinc-300 my-1 list-decimal ml-5">$1</li>')
        // 가로선
        .replace(/^---$/gm, '<hr class="border-zinc-800 my-6" />')
        // 단락 (빈 줄로 구분된 텍스트)
        .replace(/\n\n([^<\n].+)/g, '\n\n<p class="text-zinc-300 leading-[1.85] my-4">$1</p>');
}

const CATEGORIES = ["Frontend", "Backend", "Terminal", "Design", "Database"];

/* ─────────────────────────────────────
   WritePage 컴포넌트
───────────────────────────────────── */
export default function WritePage() {
    const router = useRouter();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [user, setUser] = useState<any>(null);
    const [viewMode, setViewMode] = useState<"editor" | "preview" | "split">("split");
    const [isPublishing, setIsPublishing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [savedAt, setSavedAt] = useState<string | null>(null);
    const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [showMeta, setShowMeta] = useState(false);

    const [form, setForm] = useState<FormData>({
        title: "Introduction to Markdown",
        description: "",
        content: `# Introduction

Welcome to the new post editor. This is a live preview of what you are typing.

## Features

- **Markdown** support
- Live preview side-by-side
- Syntax highlighting for code blocks

> "Code is like humor. When you have to explain it, it's bad." – Cory House

### Code Example

\`\`\`
const greet = (name) => {
  console.log(\`Hello, \${name}!\`);
};
\`\`\`
`,
        category: "Frontend",
        tags: "",
        read_time_minutes: 5,
    });

    /* ── 유저 조회 ── */
    useEffect(() => {
        getUserSession().then((user) => {
            if (!user) router.push("/login");
            else setUser(user);
        });
    }, []);

    /* ── 상태 메시지 자동 제거 ── */
    useEffect(() => {
        if (statusMsg) {
            const t = setTimeout(() => setStatusMsg(null), 3000);
            return () => clearTimeout(t);
        }
    }, [statusMsg]);

    /* ── 툴바 삽입 헬퍼 ── */
    const insertAtCursor = useCallback((before: string, after = "") => {
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const selected = form.content.substring(start, end);
        const newContent =
            form.content.substring(0, start) +
            before + selected + after +
            form.content.substring(end);
        setForm((f) => ({ ...f, content: newContent }));
        setTimeout(() => {
            ta.focus();
            ta.setSelectionRange(start + before.length, start + before.length + selected.length);
        }, 0);
    }, [form.content]);

    /* ── Save Draft ── */
    const saveDraft = async () => {
        setIsSaving(true);
        try {
            await new Promise((r) => setTimeout(r, 600)); // 저장 시뮬레이션
            const now = new Date();
            setSavedAt(`${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`);
        } finally {
            setIsSaving(false);
        }
    };

    /* ── Publish ── */
    const publish = async () => {
        if (!form.title.trim() || !form.content.trim()) {
            setStatusMsg({ type: "error", text: "제목과 내용을 입력해주세요." });
            return;
        }
        if (!form.description.trim()) {
            setShowMeta(true);
            setStatusMsg({ type: "error", text: "메타 정보(설명)를 입력해주세요." });
            return;
        }

        setIsPublishing(true);
        try {
            const tagsArr = form.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean);

            const formData = {
                title: form.title.trim(),
                description: form.description.trim(),
                content: form.content.trim(),
                category: form.category,
                tags: tagsArr,
                read_time_minutes: form.read_time_minutes,
            };

            const data = await publishPost(formData);

            setStatusMsg({ type: "success", text: "게시글이 발행되었습니다!" });
            setTimeout(() => router.push(`/post/${data.id}`), 1200);
        } catch (err: any) {
            setStatusMsg({ type: "error", text: err?.message ?? "발행 실패. 다시 시도해주세요." });
        } finally {
            setIsPublishing(false);
        }
    };

    /* ─────────────────────────────────────
       렌더
    ───────────────────────────────────── */
    return (
        <div className="h-screen bg-[#111111] text-zinc-300 flex flex-col overflow-hidden font-sans">

            {/* ─────── 상단 툴바 ─────── */}
            <header className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 bg-[#111111] shrink-0">
                {/* 왼쪽: 로고 + 브레드크럼 */}
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center font-bold text-white text-xs">D</div>
                    </Link>
                    <span className="text-zinc-600">/</span>
                    <span className="text-zinc-400 text-sm">Drafts</span>
                    <span className="text-zinc-600">/</span>
                    <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                        className="bg-transparent text-sm font-semibold text-white focus:outline-none w-64 border-b border-transparent focus:border-zinc-600 transition-colors pb-0.5"
                        placeholder="제목을 입력하세요..."
                    />
                </div>

                {/* 오른쪽: 저장시각 + 버튼들 */}
                <div className="flex items-center gap-3">
                    {savedAt && (
                        <span className="text-xs text-zinc-600 hidden sm:block">
                            {savedAt}에 저장됨
                        </span>
                    )}
                    <button
                        onClick={saveDraft}
                        disabled={isSaving}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-zinc-700 text-zinc-300 text-sm font-medium hover:border-zinc-500 hover:text-white transition-colors disabled:opacity-50"
                    >
                        <Save size={14} />
                        {isSaving ? "저장 중..." : "Save Draft"}
                    </button>
                    <button
                        onClick={() => setShowMeta(true)}
                        disabled={isPublishing}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors shadow-md disabled:opacity-50"
                    >
                        <Upload size={14} />
                        {isPublishing ? "발행 중..." : "Publish"}
                    </button>
                    {user && (
                        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700">
                            <Image
                                src={`https://i.pravatar.cc/150?u=${user.id}`}
                                alt="프로필"
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                </div>
            </header>

            {/* ─────── 마크다운 툴바 ─────── */}
            <div className="flex items-center justify-between px-5 py-2.5 border-b border-zinc-800/60 bg-[#111111] shrink-0">
                {/* 포맷 버튼들 */}
                <div className="flex items-center gap-0.5">
                    {[
                        { icon: Bold, label: "굵게", action: () => insertAtCursor("**", "**") },
                        { icon: Italic, label: "기울임", action: () => insertAtCursor("*", "*") },
                        { icon: Type, label: "제목", action: () => insertAtCursor("## ") },
                    ].map(({ icon: Icon, label, action }) => (
                        <button key={label} onClick={action} title={label}
                            className="p-2 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition-colors">
                            <Icon size={16} />
                        </button>
                    ))}
                    <div className="w-px h-5 bg-zinc-800 mx-1" />
                    {[
                        { icon: Link2, label: "링크", action: () => insertAtCursor("[", "](url)") },
                        { icon: ImageIcon, label: "이미지", action: () => insertAtCursor("![alt](", ")") },
                        { icon: Quote, label: "인용구", action: () => insertAtCursor("> ") },
                        { icon: Code2, label: "코드블록", action: () => insertAtCursor("```\n", "\n```") },
                    ].map(({ icon: Icon, label, action }) => (
                        <button key={label} onClick={action} title={label}
                            className="p-2 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition-colors">
                            <Icon size={16} />
                        </button>
                    ))}
                    <div className="w-px h-5 bg-zinc-800 mx-1" />
                    {[
                        { icon: List, label: "목록", action: () => insertAtCursor("- ") },
                        { icon: ListOrdered, label: "순서목록", action: () => insertAtCursor("1. ") },
                    ].map(({ icon: Icon, label, action }) => (
                        <button key={label} onClick={action} title={label}
                            className="p-2 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition-colors">
                            <Icon size={16} />
                        </button>
                    ))}
                </div>

                {/* 뷰 모드 토글 */}
                <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
                    {([
                        { key: "editor", label: "Editor", icon: Code2 },
                        { key: "preview", label: "Preview", icon: Eye },
                        { key: "split", label: "Split", icon: Columns2 },
                    ] as const).map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => setViewMode(key)}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${viewMode === key
                                ? "bg-blue-600 text-white"
                                : "text-zinc-500 hover:text-zinc-300"
                                }`}
                        >
                            <Icon size={13} />
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ─────── 에디터 / 프리뷰 영역 ─────── */}
            <div className="flex flex-1 overflow-hidden">
                {/* 에디터 */}
                {(viewMode === "editor" || viewMode === "split") && (
                    <div className={`flex flex-1 overflow-hidden ${viewMode === "split" ? "border-r border-zinc-800" : ""}`}>
                        {/* 줄번호 */}
                        <div className="select-none w-10 shrink-0 pt-5 pr-3 text-right bg-[#111111] border-r border-zinc-900">
                            {form.content.split("\n").map((_, i) => (
                                <div key={i} className="text-[11px] text-zinc-700 leading-[1.75rem] font-mono">
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                        {/* 텍스트에리어 */}
                        <textarea
                            ref={textareaRef}
                            value={form.content}
                            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                            className="flex-1 bg-[#111111] text-zinc-300 text-sm font-mono leading-7 resize-none focus:outline-none p-5 overflow-y-auto"
                            spellCheck={false}
                            placeholder="마크다운으로 작성하세요..."
                        />
                    </div>
                )}

                {/* 프리뷰 */}
                {(viewMode === "preview" || viewMode === "split") && (
                    <div className="flex-1 overflow-y-auto bg-[#111111]">
                        <div
                            className="max-w-[720px] mx-auto px-10 py-8 text-zinc-300"
                            dangerouslySetInnerHTML={{ __html: parseMarkdown(form.content) }}
                        />
                    </div>
                )}
            </div>

            {/* ─────── 발행 메타 정보 모달 ─────── */}
            {showMeta && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#161616] border border-zinc-800 rounded-2xl w-full max-w-lg p-8 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">게시글 정보</h2>
                            <button onClick={() => setShowMeta(false)} className="text-zinc-500 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-5">
                            {/* 설명 */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1.5">설명 <span className="text-red-400">*</span></label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                    placeholder="게시글을 한 줄로 요약하세요..."
                                    rows={3}
                                    className="w-full bg-[#1c1c1c] border border-zinc-800 rounded-lg p-3 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 resize-none"
                                />
                            </div>

                            {/* 카테고리 */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1.5">카테고리</label>
                                <div className="relative">
                                    <select
                                        value={form.category}
                                        onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                                        className="w-full bg-[#1c1c1c] border border-zinc-800 rounded-lg py-2.5 px-3 text-sm text-zinc-300 focus:outline-none focus:border-zinc-600 appearance-none"
                                    >
                                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-3 text-zinc-500 pointer-events-none" />
                                </div>
                            </div>

                            {/* 태그 */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1.5">태그 <span className="text-zinc-600">(쉼표로 구분)</span></label>
                                <input
                                    type="text"
                                    value={form.tags}
                                    onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                                    placeholder="예: React, TypeScript, Web"
                                    className="w-full bg-[#1c1c1c] border border-zinc-800 rounded-lg py-2.5 px-3 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
                                />
                            </div>

                            {/* 읽기 시간 */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1.5">읽기 시간 (분)</label>
                                <input
                                    type="number"
                                    min={1} max={60}
                                    value={form.read_time_minutes}
                                    onChange={(e) => setForm((f) => ({ ...f, read_time_minutes: Number(e.target.value) }))}
                                    className="w-full bg-[#1c1c1c] border border-zinc-800 rounded-lg py-2.5 px-3 text-sm text-zinc-300 focus:outline-none focus:border-zinc-600"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setShowMeta(false)}
                                className="flex-1 py-2.5 rounded-lg border border-zinc-800 text-zinc-400 text-sm font-medium hover:border-zinc-600 hover:text-white transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={() => { setShowMeta(false); publish(); }}
                                disabled={isPublishing}
                                className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors shadow-md disabled:opacity-50"
                            >
                                {isPublishing ? "발행 중..." : "🚀 발행하기"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─────── 토스트 메시지 ─────── */}
            {statusMsg && (
                <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-xl border shadow-2xl text-sm font-medium transition-all ${statusMsg.type === "success"
                    ? "bg-green-600/20 border-green-500/40 text-green-400"
                    : "bg-red-600/20 border-red-500/40 text-red-400"
                    }`}>
                    {statusMsg.type === "success" ? "✓" : "✕"} {statusMsg.text}
                </div>
            )}
        </div>
    );
}
