// app/transactions/components/TransactionForm.tsx
'use client';
import { format } from 'date-fns';
import { useState } from 'react';
import Form, { FormField } from '../../components/Form';
import { useCategories } from '../../hooks/useCategories';
import { useUserData } from '../../hooks/useUserData';

export default function TransactionForm({ onAdd }: { onAdd: (transaction: any) => void }) {
    const { data: userData } = useUserData();
    const { categories } = useCategories(userData?.user?.id);

    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [type, setType] = useState<'expense' | 'income'>('expense');
    const [categoryId, setCategoryId] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAmountChange = (value: string) => {
        const numericValue = value.replace(/\D/g, '');
        setAmount(numericValue ? (Number(numericValue) / 100).toFixed(2) : '');
    };

    const handleSubmit = async () => {
        setError(null);
        setIsSubmitting(true);

        try {
            if (!description || !amount || !date || !categoryId) {
                throw new Error('All fields are required');
            }

            await onAdd({
                description,
                amount: Number(amount),
                currency,
                date,
                type,
                category: categoryId
            });

            // Reset form
            setDescription('');
            setAmount('');
            setCategoryId('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const fields: FormField[] = [
        {
            label: 'Description',
            type: 'text' as const,
            name: 'description',
            value: description,
            onChange: setDescription,
            required: true
        },
        {
            label: 'Amount',
            type: 'text' as const, // Or 'number' if you prefer
            name: 'amount',
            value: amount ? `$${amount}` : '',
            onChange: handleAmountChange,
            required: true
        },
        {
            label: 'Currency',
            type: 'select' as const,
            name: 'currency',
            value: currency,
            onChange: setCurrency,
            options: [
                { value: 'USD', label: 'USD ($)' },
                { value: 'EUR', label: 'EUR (€)' },
                { value: 'BRL', label: 'BRL (R$)' }
            ],
            required: true
        },
        {
            label: 'Date',
            type: 'date' as const,
            name: 'date',
            value: date,
            onChange: setDate,
            required: true
        },
        {
            label: 'Type',
            type: 'radio-group' as const,
            name: 'type',
            value: type,
            onChange: setType,
            options: [
                { value: 'expense', label: 'Expense' },
                { value: 'income', label: 'Income' }
            ],
            required: true
        },
        {
            label: 'Category',
            type: 'select' as const,
            name: 'category',
            value: categoryId,
            onChange: setCategoryId,
            options: categories.map(category => ({
                value: category._id,
                label: category.name
            })),
            required: true
        }
    ];


    return (
        <Form
            fields={fields}
            onSubmit={handleSubmit}
            submitText={isSubmitting ? 'Adding...' : 'Add Transaction'}
            isSubmitting={isSubmitting}
            error={error}
        />
    );
}