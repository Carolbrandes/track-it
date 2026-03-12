'use client'

import { cn } from '@/app/lib/cn';

interface ToastProps {
    message: string
    type: 'success' | 'error' | 'info'
}

const typeStyles = {
    success: 'bg-success',
    error: 'bg-danger',
    info: 'bg-tertiary',
} as const;

export const Toast = ({ message, type }: ToastProps) => {
    return (
        <div className={cn(
            "text-text-secondary p-4 rounded-lg mb-4 border border-success fixed right-8 bottom-8 w-fit",
            typeStyles[type]
        )}>
            {message}
        </div>
    );
};
