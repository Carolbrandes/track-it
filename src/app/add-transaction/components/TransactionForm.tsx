'use client';
import { format } from 'date-fns';
import { ChangeEvent, useEffect, useState } from 'react';
import { NumberFormatValues } from 'react-number-format';
import CategoryAutocomplete from '../../components/CategoryAutocomplete';
import Form, { FormField } from '../../components/Form';
import { Toast } from '../../components/Toast';
import { useTranslation } from '../../i18n/LanguageContext';
import { Category, useCategories } from '../../hooks/useCategories';
import { useCurrency } from '../../hooks/useCurrency';
import { Transaction } from '../../hooks/useTransactions';
import { useUserData } from '../../hooks/useUserData';
import * as S from '../styles';

export type TransactionType = Omit<Transaction, '_id' | 'userId'>


export default function TransactionForm({ onAdd }: { onAdd: (transaction: TransactionType) => void }) {
    const { t } = useTranslation();
    const { data: userData } = useUserData()
    const { categories, addCategory: addCategoryMutation } = useCategories(userData?._id);
    const { selectedCurrencyCode } = useCurrency();


    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [type, setType] = useState<'expense' | 'income'>('expense');
    const [categoryId, setCategoryId] = useState('');
    const [isFixed, setIsFixed] = useState(false);
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
        const target = event.target as HTMLInputElement | HTMLSelectElement;

        if (!target) {
            console.error("event.target is undefined");
            return;
        }

        const { name, value } = target;

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
                throw new Error(t.transactionForm.allFieldsRequired);
            }

            await onAdd({
                description,
                amount: Number(amount.replace(/[^0-9.-]+/g, "")),
                currency: userData.currencyId,
                date: new Date(date),
                type,
                is_fixed: isFixed,
                category: categoryId
            });

            setSuccessMsg(t.transactionForm.success);


            setDescription('');
            setAmount('');
            setType('expense');
            setIsFixed(false);

            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (err) {
            console.error("🚀 ~ handleSubmit ~ err:", err)
            setError(t.transactionForm.saveError);
        } finally {
            setIsSubmitting(false);
        }
    };

    const fields: FormField[] = [
        {
            label: t.transactionForm.description,
            type: 'text',
            name: 'description',
            value: description,
            onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => handleFieldChange(event),
            required: true,
            placeholder: t.transactionForm.descriptionPlaceholder
        },
        {
            label: t.transactionForm.amount,
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
            label: t.transactionForm.date,
            type: 'date',
            name: 'date',
            value: date,
            onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => handleFieldChange(event),
            required: true
        },
        {
            label: t.transactionForm.type,
            type: 'radio-group',
            name: 'type',
            value: type,
            onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => handleFieldChange(event),
            options: [
                { value: 'expense', label: t.transactions.expense },
                { value: 'income', label: t.transactions.income }
            ],
            required: true
        },
        {
            label: t.transactionForm.category,
            type: 'custom' as const,
            name: 'category',
            value: categoryId,
            component: (
                <CategoryAutocomplete
                    categories={categories}
                    selectedId={categoryId}
                    onSelect={(id) => setCategoryId(id)}
                    onCreateNew={async (name): Promise<Category | void> => {
                        const newCat = await addCategoryMutation(name);
                        if (newCat?._id) {
                            setCategoryId(newCat._id);
                            return newCat;
                        }
                    }}
                />
            ),
            required: true
        },
        {
            label: t.transactionForm.fixedTransaction,
            type: 'custom' as const,
            name: 'is_fixed',
            value: isFixed ? 'true' : 'false',
            component: (
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={isFixed}
                        onChange={(e) => setIsFixed(e.target.checked)}
                        style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                    />
                    {t.transactionForm.fixedTransaction}
                </label>
            )
        }
    ];

    return (
        <>
            <Form
                fields={fields}
                onSubmit={handleSubmit}
                submitText={isSubmitting ? t.transactionForm.adding : t.transactionForm.addButton}
                isSubmitting={isSubmitting}
                error={error}
            />

            {successMsg && <Toast type='success' message={successMsg} />}

        </>

    );
}