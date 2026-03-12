'use client';

import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { NumericFormat, NumberFormatValues } from 'react-number-format';
import { Category } from '../../hooks/useCategories';
import { useCurrency } from '../../hooks/useCurrency';
import { useTranslation } from '../../i18n/LanguageContext';
import CategoryAutocomplete from '../CategoryAutocomplete';
import { DateInput } from '../DateInput';

const inputClasses =
    'py-[0.6rem] px-3 text-[0.95rem] border border-gray-300 rounded-lg bg-background text-text-primary transition-colors duration-200 font-[inherit] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/[0.13]';

interface AddTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (transaction: {
        description: string;
        amount: number;
        currency: string;
        date: Date;
        type: 'expense' | 'income';
        is_fixed: boolean;
        category: string;
    }) => Promise<void>;
    categories: Category[];
    addCategory: (name: string) => Promise<Category | undefined>;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
    isOpen,
    onClose,
    onAdd,
    categories,
    addCategory,
}) => {
    const { t } = useTranslation();
    const { selectedCurrencyCode } = useCurrency();

    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [type, setType] = useState<'expense' | 'income'>('expense');
    const [categoryId, setCategoryId] = useState('');
    const [isFixed, setIsFixed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (categories.length > 0 && !categoryId) {
            setCategoryId(categories[0]._id);
        }
    }, [categories, categoryId]);

    const resetForm = () => {
        setDescription('');
        setAmount('');
        setDate(format(new Date(), 'yyyy-MM-dd'));
        setType('expense');
        setCategoryId(categories[0]?._id || '');
        setIsFixed(false);
        setError(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async () => {
        setError(null);

        if (!description || !amount || !date || !categoryId) {
            setError(t.transactionForm.allFieldsRequired);
            return;
        }

        setIsSubmitting(true);
        try {
            await onAdd({
                description,
                amount: Number(amount),
                currency: selectedCurrencyCode,
                date: new Date(date),
                type,
                is_fixed: isFixed,
                category: categoryId,
            });
            resetForm();
            onClose();
        } catch {
            setError(t.transactionForm.saveError);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAmountChange = (values: NumberFormatValues) => {
        setAmount(values.value);
    };

    const handleCreateCategory = async (name: string): Promise<Category | void> => {
        try {
            const newCat = await addCategory(name);
            if (newCat?._id) {
                setCategoryId(newCat._id);
                return newCat;
            }
        } catch (error) {
            console.error('Failed to create category', error);
            setError(t.transactionForm.createError || 'Error creating category');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 w-screen h-screen bg-black/50 flex justify-center items-center z-[200]">
            <div className="bg-surface p-6 rounded-[14px] w-[420px] max-w-[95%] shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-gray-300">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="m-0 text-[1.2rem] text-text-primary">{t.transactionForm.addTitle}</h3>
                    <button
                        className="bg-transparent border-none text-lg cursor-pointer text-text-secondary p-1 hover:text-text-primary"
                        onClick={handleClose}
                    >
                        ✕
                    </button>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-[0.3rem]">
                        <label className="text-[0.85rem] font-semibold text-text-secondary">{t.transactionForm.description}</label>
                        <input
                            className={inputClasses}
                            type="text"
                            placeholder={t.transactionForm.descriptionPlaceholder}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-[0.3rem]">
                        <label className="text-[0.85rem] font-semibold text-text-secondary">{t.transactionForm.amount}</label>
                        <NumericFormat
                            className={`${inputClasses} w-full`}
                            value={amount}
                            onValueChange={handleAmountChange}
                            thousandSeparator
                            prefix={selectedCurrencyCode + ' '}
                            decimalScale={2}
                            fixedDecimalScale
                            allowNegative={false}
                            placeholder="0.00"
                        />
                    </div>

                    <div className="flex flex-col gap-[0.3rem]">
                        <label className="text-[0.85rem] font-semibold text-text-secondary">{t.transactionForm.date}</label>
                        <DateInput
                            value={date}
                            onChange={(val) => setDate(val)}
                        />
                    </div>

                    <div className="flex flex-col gap-[0.3rem]">
                        <label className="text-[0.85rem] font-semibold text-text-secondary">{t.transactionForm.type}</label>
                        <select
                            className={inputClasses}
                            value={type}
                            onChange={(e) => setType(e.target.value as 'expense' | 'income')}
                        >
                            <option value="expense">{t.editModal.expense}</option>
                            <option value="income">{t.editModal.income}</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-[0.3rem]">
                        <label className="text-[0.85rem] font-semibold text-text-secondary">{t.transactionForm.category}</label>
                        <CategoryAutocomplete
                            categories={categories}
                            selectedId={categoryId}
                            onSelect={(id) => setCategoryId(id)}
                            onCreateNew={handleCreateCategory}
                        />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer mt-1">
                        <input
                            type="checkbox"
                            checked={isFixed}
                            onChange={(e) => setIsFixed(e.target.checked)}
                            className="w-[1.1rem] h-[1.1rem] cursor-pointer accent-primary"
                        />
                        {t.transactionForm.fixedTransaction}
                    </label>

                    {error && (
                        <div className="text-danger text-[0.85rem]">{error}</div>
                    )}

                    <div className="flex gap-3 mt-2">
                        <button
                            className="flex-1 py-[0.65rem] text-[0.95rem] font-semibold border-none rounded-lg cursor-pointer transition-opacity duration-200 font-[inherit] bg-primary text-white hover:opacity-85"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? t.transactionForm.adding : t.transactionForm.addButton}
                        </button>
                        <button
                            className="flex-1 py-[0.65rem] text-[0.95rem] font-semibold border-none rounded-lg cursor-pointer transition-opacity duration-200 font-[inherit] bg-gray-300 text-text-primary hover:opacity-85"
                            onClick={handleClose}
                        >
                            {t.editModal.cancel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddTransactionModal;
