import { describe, expect, it } from 'vitest';
import {
    createCategorySchema,
    createTransactionSchema,
    sendCodeSchema,
    updateCurrencySchema,
    updateTransactionSchema,
    verifyCodeSchema,
} from '../app/lib/validations';

describe('sendCodeSchema', () => {
    it('accepts a valid email', () => {
        const result = sendCodeSchema.safeParse({ email: 'user@example.com' });
        expect(result.success).toBe(true);
    });

    it('rejects an invalid email', () => {
        const result = sendCodeSchema.safeParse({ email: 'not-an-email' });
        expect(result.success).toBe(false);
    });

    it('rejects empty payload', () => {
        const result = sendCodeSchema.safeParse({});
        expect(result.success).toBe(false);
    });
});

describe('verifyCodeSchema', () => {
    it('accepts valid email and 6-digit code', () => {
        const result = verifyCodeSchema.safeParse({ email: 'user@example.com', code: '123456' });
        expect(result.success).toBe(true);
    });

    it('rejects code shorter than 6 characters', () => {
        const result = verifyCodeSchema.safeParse({ email: 'user@example.com', code: '123' });
        expect(result.success).toBe(false);
    });

    it('rejects code longer than 6 characters', () => {
        const result = verifyCodeSchema.safeParse({ email: 'user@example.com', code: '1234567' });
        expect(result.success).toBe(false);
    });

    it('rejects missing email', () => {
        const result = verifyCodeSchema.safeParse({ code: '123456' });
        expect(result.success).toBe(false);
    });
});

describe('createTransactionSchema', () => {
    const validTransaction = {
        description: 'Groceries',
        amount: 50.25,
        currency: 'USD',
        date: '2026-02-16',
        type: 'expense' as const,
        category: '507f1f77bcf86cd799439011',
    };

    it('accepts a valid transaction', () => {
        const result = createTransactionSchema.safeParse(validTransaction);
        expect(result.success).toBe(true);
    });

    it('accepts transaction with is_fixed true', () => {
        const result = createTransactionSchema.safeParse({ ...validTransaction, is_fixed: true });
        expect(result.success).toBe(true);
    });

    it('accepts transaction with is_fixed null', () => {
        const result = createTransactionSchema.safeParse({ ...validTransaction, is_fixed: null });
        expect(result.success).toBe(true);
    });

    it('accepts transaction without is_fixed', () => {
        const result = createTransactionSchema.safeParse(validTransaction);
        expect(result.success).toBe(true);
    });

    it('rejects negative amount', () => {
        const result = createTransactionSchema.safeParse({ ...validTransaction, amount: -10 });
        expect(result.success).toBe(false);
    });

    it('rejects invalid type', () => {
        const result = createTransactionSchema.safeParse({ ...validTransaction, type: 'transfer' });
        expect(result.success).toBe(false);
    });

    it('rejects empty description', () => {
        const result = createTransactionSchema.safeParse({ ...validTransaction, description: '' });
        expect(result.success).toBe(false);
    });

    it('rejects missing required fields', () => {
        const result = createTransactionSchema.safeParse({ description: 'test' });
        expect(result.success).toBe(false);
    });
});

describe('updateTransactionSchema', () => {
    const validUpdate = {
        description: 'Updated groceries',
        amount: 75,
        currency: 'BRL',
        type: 'income' as const,
        category: '507f1f77bcf86cd799439011',
    };

    it('accepts a valid update payload', () => {
        const result = updateTransactionSchema.safeParse(validUpdate);
        expect(result.success).toBe(true);
    });

    it('rejects zero amount', () => {
        const result = updateTransactionSchema.safeParse({ ...validUpdate, amount: 0 });
        expect(result.success).toBe(false);
    });
});

describe('createCategorySchema', () => {
    it('accepts a valid category name', () => {
        const result = createCategorySchema.safeParse({ name: 'Food' });
        expect(result.success).toBe(true);
    });

    it('rejects empty name', () => {
        const result = createCategorySchema.safeParse({ name: '' });
        expect(result.success).toBe(false);
    });

    it('rejects missing name', () => {
        const result = createCategorySchema.safeParse({});
        expect(result.success).toBe(false);
    });
});

describe('updateCurrencySchema', () => {
    it('accepts a valid currencyId', () => {
        const result = updateCurrencySchema.safeParse({ currencyId: '507f1f77bcf86cd799439011' });
        expect(result.success).toBe(true);
    });

    it('rejects empty currencyId', () => {
        const result = updateCurrencySchema.safeParse({ currencyId: '' });
        expect(result.success).toBe(false);
    });
});
