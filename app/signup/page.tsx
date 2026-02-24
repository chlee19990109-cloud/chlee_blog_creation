import { signup } from '@/app/login/actions'
import { SubmitButton } from '@/app/components/SubmitButton'
import { Mail, EyeOff, ArrowRight, Hexagon } from 'lucide-react'
import Link from 'next/link'

export default async function SignupPage(props: { searchParams: Promise<{ message: string }> }) {
    const searchParams = await props.searchParams;
    return (
        <div className="min-h-screen bg-[#111318] text-white flex flex-col font-sans">
            {/* Header */}
            <header className="flex justify-between items-center px-8 py-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#3e56f4] rounded flex items-center justify-center">
                        <Hexagon className="w-5 h-5 text-white fill-white" />
                    </div>
                    <span className="font-bold text-xl">DevBlog</span>
                </div>
                <nav className="flex gap-6 text-sm text-gray-300">
                    <Link href="#" className="hover:text-white transition-colors">Documentation</Link>
                    <Link href="#" className="hover:text-white transition-colors">Pricing</Link>
                    <Link href="#" className="hover:text-white transition-colors">Changelog</Link>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-sm">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold mb-2">가입하기</h1>
                        <p className="text-gray-400 text-sm">무료로 계정을 생성하세요.</p>
                    </div>

                    <form className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-200" htmlFor="email">
                                이메일 주소
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    required
                                    className="w-full bg-[#1c1e26] border border-gray-800 rounded-lg py-3 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#3e56f4] transition-colors pr-10"
                                />
                                <Mail className="absolute right-4 top-3 w-5 h-5 text-gray-500 pointer-events-none" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-200" htmlFor="password">
                                비밀번호
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="w-full bg-[#1c1e26] border border-gray-800 rounded-lg py-3 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#3e56f4] transition-colors pr-10 tracking-widest"
                                />
                                <EyeOff className="absolute right-4 top-3 w-5 h-5 text-gray-500 pointer-events-none" />
                            </div>
                        </div>

                        {searchParams?.message && (
                            <div className={`text-sm p-3 rounded-lg border flex flex-col gap-1 mt-1 ${searchParams.message.includes('성공') ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-red-500 bg-red-500/10 border-red-500/20'}`}>
                                <span>{searchParams.message}</span>
                            </div>
                        )}

                        <SubmitButton formAction={signup} pendingText="가입 중..." className="mt-2">
                            계정 생성 <ArrowRight className="w-4 h-4 ml-2" />
                        </SubmitButton>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-400">
                        이미 계정이 있으신가요? <Link href="/login" className="text-[#3e56f4] hover:text-[#5c71fc] font-medium ml-1">로그인하기</Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-8 text-center text-xs text-gray-500">
                © 2024 DevBlog Platform. All rights reserved.
            </footer>
        </div>
    )
}
