'use client'

import { useFormStatus } from 'react-dom'
import { ReactNode } from 'react'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    pendingText?: string
    children: ReactNode
}

export function SubmitButton({ children, pendingText, ...props }: Props) {
    const { pending } = useFormStatus()

    return (
        <button
            {...props}
            type="submit"
            disabled={pending || props.disabled}
            className={`bg-[#3e56f4] hover:bg-[#3245c4] text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 ${props.className || ''}`}
        >
            {pending ? pendingText : children}
        </button>
    )
}
