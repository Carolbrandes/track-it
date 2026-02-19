import { z } from 'zod';

export const sendCodeSchema = z.object({
    email: z.email(),
});

export const verifyCodeSchema = z.object({
    email: z.email(),
    code: z.string().min(6).max(6),
});

export const createTransactionSchema = z.object({
    description: z.string().min(1),
    amount: z.number().positive(),
    currency: z.string().min(1),
    date: z.string().min(1),
    type: z.enum(['expense', 'income']),
    category: z.string().min(1),
    is_fixed: z.boolean().nullable().optional(),
});

export const updateTransactionSchema = z.object({
    description: z.string().min(1),
    amount: z.number().positive(),
    currency: z.string().min(1),
    type: z.enum(['expense', 'income']),
    category: z.string().min(1),
    is_fixed: z.boolean().nullable().optional(),
});

export const createCategorySchema = z.object({
    name: z.string().min(1),
});

export const updateCategorySchema = z.object({
    name: z.string().min(1),
});

export const updateCurrencySchema = z.object({
    currencyId: z.string().min(1),
});

export function formatZodError(error: z.ZodError): string {
    return error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(', ');
}
