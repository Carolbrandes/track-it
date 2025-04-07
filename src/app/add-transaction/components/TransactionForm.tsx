'use client';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import Form, { FormField } from '../../components/Form';
import { Toast } from '../../components/Toast';
import { useCategories } from '../../hooks/useCategories';
import { Transaction } from '../../hooks/useTransactions';
import { useUserData } from '../../hooks/useUserData';

export type TransactionType = Omit<Transaction, '_id' | 'userId'>


export default function TransactionForm({ onAdd }: { onAdd: (transaction: TransactionType) => void }) {
    const { data: userData } = useUserData();
    const { categories } = useCategories(userData?._id);
    const { data: UserData } = useUserData()


    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
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
    }, [categories, categoryId]);

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
                currency: UserData.currencyId,
                date: new Date(date),
                type,
                category: categoryId
            });

            setSuccessMsg('Transaction successfully registered!');


            setDescription('');
            setAmount('');
            setType('expense');

            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (err) {
            console.error("🚀 ~ handleSubmit ~ err:", err)
            setError("Error on save new transaction");
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
            onChange: (value: string) => setType(value as 'expense' | 'income'), // 🔥 Converte explicitamente para o tipo correto
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