'use client';
import { format } from 'date-fns';
import { ChangeEvent, useEffect, useState } from 'react';
import { NumberFormatValues } from 'react-number-format';
import Form, { FormField } from '../../components/Form';
import { Toast } from '../../components/Toast';
import { useCategories } from '../../hooks/useCategories';
import { useCurrency } from '../../hooks/useCurrency';
import { Transaction } from '../../hooks/useTransactions';
import { useUserData } from '../../hooks/useUserData';
import * as S from '../styles';

export type TransactionType = Omit<Transaction, '_id' | 'userId'>


export default function TransactionForm({ onAdd }: { onAdd: (transaction: TransactionType) => void }) {
    const { data: userData } = useUserData()
    const { categories } = useCategories(userData?._id);
    const { selectedCurrencyCode } = useCurrency();


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

    const handleAmountChange = (values: NumberFormatValues) => {
        const { value } = values;
        setAmount(value);
    };

    const handleFieldChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        console.log("Event received: ", event);

        const target = event.target as HTMLInputElement | HTMLSelectElement;

        if (!target) {
            console.error("event.target is undefined");
            return;
        }

        const { name, value } = target;
        console.log("🚀 ~ TransactionForm ~ name:", name);
        console.log("🚀 ~ TransactionForm ~ value:", value);

        switch (name) {
            case 'description':
                setDescription(value);
                break;
            case 'date':
                setDate(value);
                break;
            case 'type':
                setType(value as 'expense' | 'income');
                break;
            case 'category':
                setCategoryId(value);
                break;
            default:
                break;
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
                amount: Number(amount.replace(/[^0-9.-]+/g, "")),
                currency: userData.currencyId,
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
            onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => handleFieldChange(event),
            required: true,
            placeholder: 'e.g. Salary, Groceries'
        },
        {
            label: 'Amount',
            type: 'custom',
            name: 'amount',
            value: amount,
            onAmountChange: handleAmountChange,
            required: true,
            placeholder: '0.00',
            component: (
                <S.StyledNumericFormat
                    value={amount}
                    onValueChange={handleAmountChange}
                    thousandSeparator={true}
                    prefix={selectedCurrencyCode + ' '}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    allowNegative={false}
                    placeholder="0.00"
                />
            )
        },
        {
            label: 'Date',
            type: 'date',
            name: 'date',
            value: date,
            onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => handleFieldChange(event),
            required: true
        },
        {
            label: 'Type',
            type: 'radio-group',
            name: 'type',
            value: type,
            onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => handleFieldChange(event),
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
            onChange: handleFieldChange,
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