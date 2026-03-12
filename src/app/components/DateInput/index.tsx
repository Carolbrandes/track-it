'use client';

import { cn } from '@/app/lib/cn';

interface DateInputProps {
    readonly value: string;
    readonly onChange: (value: string) => void;
    readonly name?: string;
    readonly placeholder?: string;
    readonly required?: boolean;
    readonly className?: string;
}

export function DateInput({ value, onChange, name, placeholder, required, className }: DateInputProps) {
    return (
        <input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            name={name}
            placeholder={placeholder}
            required={required}
            className={cn(
                "px-3 py-2.5 text-[0.95rem] border border-gray-300 rounded-lg bg-background text-text-primary transition-[border-color] duration-200 font-[inherit] w-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/[0.13]",
                className
            )}
        />
    );
}
