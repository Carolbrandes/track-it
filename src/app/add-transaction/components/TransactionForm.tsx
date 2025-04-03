'use client';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import Form, { FormField } from '../../components/Form';
import { Toast } from '../../components/Toast';
import { useCategories } from '../../hooks/useCategories';
import { useUserData } from '../../hooks/useUserData';
import { Transaction } from '../page';

export default function TransactionForm({ onAdd }: { onAdd: (transaction: Transaction) => void }) {
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
    const [successMsg, setSuccessMsg] = useState<string | null>(null);


    useEffect(() => {
        if (categories.length > 0 && !categoryId) {
            setCategoryId(categories[0]._id);
        }
    }, [categories]);

    const handleAmountChange = (value: string) => {
        const numericValue = value.replace(/[^0-9.]/g, '');
        if (/^\d*\.?\d{0,2}$/.test(numericValue)) {
            setAmount(numericValue);
        }
    };

    const handleSubmit = async () => {
        setError(null);
        setIsSubmitting(true);
        setSuccessMsg(null);

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

            setSuccessMsg('Transaction successfully registered!');


            setDescription('');
            setAmount('');
            setType('expense');

            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const fields: FormField[] = [
        {
            label: 'Description',
            type: 'text',
            name: 'description',
            value: description,
            onChange: setDescription,
            required: true,
            placeholder: 'e.g. Salary, Groceries'
        },
        {
            label: 'Amount',
            type: 'text',
            name: 'amount',
            value: amount,
            onChange: handleAmountChange,
            required: true,
            placeholder: '0.00'
        },
        {
            label: 'Currency',
            type: 'select',
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
            type: 'date',
            name: 'date',
            value: date,
            onChange: setDate,
            required: true
        },
        {
            label: 'Type',
            type: 'radio-group',
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
            type: 'select',
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
        <>
            <Form
                fields={fields}
                onSubmit={handleSubmit}
                submitText={isSubmitting ? 'Adding...' : 'Add Transaction'}
                isSubmitting={isSubmitting}
                error={error}
            />

            {successMsg && <Toast type='success' message={successMsg} />}

        </>

    );
}