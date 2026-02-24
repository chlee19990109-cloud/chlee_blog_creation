"use server";

import { createClient } from "@/utils/supabase/server";

export async function getUserSession() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

export async function getPosts(options: {
    category: string;
    searchQuery: string;
    page: number;
    postsPerPage: number;
}) {
    const supabase = await createClient();
    const { category, searchQuery, page, postsPerPage } = options;

    let query = supabase
        .from("posts")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

    if (category !== "전체 글") {
        query = query.eq("category", category);
    }
    if (searchQuery.trim()) {
        query = query.ilike("title", `%${searchQuery.trim()}%`);
    }

    const from = (page - 1) * postsPerPage;
    const to = from + postsPerPage - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
        console.error("게시글 조회 오류:", error);
        return { data: [], count: 0 };
    }

    return { data: data ?? [], count: count ?? 0 };
}

export async function getPostDetail(postId: string) {
    const supabase = await createClient();

    const [{ data: postData, error: postErr }, { data: commentData }] = await Promise.all([
        supabase.from("posts").select("*").eq("id", postId).single(),
        supabase.from("comments").select("*").eq("post_id", postId).order("created_at", { ascending: true }),
    ]);

    if (postErr || !postData) {
        console.error("게시글 상세 조회 오류:", postErr);
        return { post: null, comments: [] };
    }

    return { post: postData, comments: commentData ?? [] };
}

export async function publishPost(formData: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("로그인이 필요합니다.");
    }

    const { data, error } = await supabase.from("posts").insert({
        ...formData,
        author_name: user?.email?.split("@")[0] ?? "Anonymous",
        author_image: `https://i.pravatar.cc/150?u=${user?.id ?? "anon"}`,
        image_url: null,
    }).select().single();

    if (error) {
        console.error("게시글 작성 오류:", error);
        throw new Error(error.message);
    }

    return data;
}
