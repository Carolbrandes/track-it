'use client';

import { Category } from '@/app/hooks/useCategories';
import { useCurrency } from '@/app/hooks/useCurrency';
import React, { useEffect, useState } from 'react';
import { NumericFormat, NumberFormatValues } from 'react-number-format';
import { useTranslation } from '../../i18n/LanguageContext';
import { Transaction } from '../../hooks/useTransactions';
import { TransactionToEdit } from '../../page';
import { DateInput } from '../DateInput';

const inputClasses =
    'py-[0.6rem] px-3 text-[0.95rem] border border-gray-300 rounded-lg bg-background text-text-primary transition-colors duration-200 font-[inherit] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/[0.13]';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedTransaction: TransactionToEdit) => void;
    transaction: Transaction;
    categories: Category[];
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, transaction, categories }) => {
    const { t } = useTranslation();
    const { selectedCurrencyCode } = useCurrency();
    const [updatedTransaction, setUpdatedTransaction] = useState(transaction);

    useEffect(() => {
        setUpdatedTransaction(transaction);
    }, [transaction]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUpdatedTransaction((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAmountChange = (values: NumberFormatValues) => {
        setUpdatedTransaction((prev) => ({
            ...prev,
            amount: Number(values.value) || 0,
        }));
    };

    const handleSave = () => {
        const categoryId = typeof updatedTransaction.category === 'string'
            ? updatedTransaction.category
            : updatedTransaction.category?._id || '';

        const transactionToSave: TransactionToEdit = {
            ...updatedTransaction,
            category: categoryId,
        };

        onSave(transactionToSave);
    };

    if (!isOpen) return null;

    const categoryValue = (typeof updatedTransaction.category === 'object' && updatedTransaction.category !== null
        ? updatedTransaction.category._id
        : updatedTransaction.category || '') as string;

    return (
        <div className="fixed inset-0 w-screen h-screen bg-black/50 flex justify-center items-center z-[200]">
            <div className="bg-surface p-6 rounded-[14px] w-[420px] max-w-[95%] shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-gray-300">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="m-0 text-[1.2rem] text-text-primary">{t.editModal.title}</h3>
                    <button
                        className="bg-transparent border-none text-lg cursor-pointer text-text-secondary p-1 hover:text-text-primary"
                        onClick={onClose}
                    >
                        X
                    </button>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-[0.3rem]">
                        <label className="text-[0.85rem] font-semibold text-text-secondary">{t.editModal.description}</label>
                        <input
                            className={inputClasses}
                            type="text"
                            name="description"
                            value={updatedTransaction.description}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="flex flex-col gap-[0.3rem]">
                        <label className="text-[0.85rem] font-semibold text-text-secondary">{t.editModal.selectCategory}</label>
                        <select
                            className={inputClasses}
                            name="category"
                            value={categoryValue}
                            onChange={handleInputChange}
                        >
                            <option value="">{t.editModal.selectCategory}</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-[0.3rem]">
                        <label className="text-[0.85rem] font-semibold text-text-secondary">{t.transactionForm.type}</label>
                        <select
                            className={inputClasses}
                            name="type"
                            value={updatedTransaction.type}
                            onChange={handleInputChange}
                        >
                            <option value="income">{t.editModal.income}</option>
                            <option value="expense">{t.editModal.expense}</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-[0.3rem]">
                        <label className="text-[0.85rem] font-semibold text-text-secondary">{t.editModal.amount}</label>
                        <NumericFormat
                            className={`${inputClasses} w-full`}
                            value={updatedTransaction.amount}
                            onValueChange={handleAmountChange}
                            thousandSeparator={true}
                            prefix={selectedCurrencyCode + ' '}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            allowNegative={false}
                        />
                    </div>

                    <div className="flex flex-col gap-[0.3rem]">
                        <label className="text-[0.85rem] font-semibold text-text-secondary">{t.transactionForm.date}</label>
                        <DateInput
                            name="date"
                            value={(() => {
                                const d = updatedTransaction.date;
                                if (!d) return '';
                                return new Date(d).toISOString().slice(0, 10);
                            })()}
                            onChange={(val) => setUpdatedTransaction((prev) => ({
                                ...prev,
                                date: new Date(val) as unknown as Date,
                            }))}
                        />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer mt-1">
                        <input
                            type="checkbox"
                            checked={updatedTransaction.is_fixed || false}
                            onChange={(e) => setUpdatedTransaction(prev => ({ ...prev, is_fixed: e.target.checked }))}
                            className="w-[1.2rem] h-[1.2rem] cursor-pointer"
                        />
                        {t.transactionForm.fixedTransaction}
                    </label>

                    <div className="flex gap-3 mt-2">
                        <button
                            className="flex-1 py-[0.65rem] text-[0.95rem] font-semibold border-none rounded-lg cursor-pointer transition-opacity duration-200 font-[inherit] bg-primary text-white hover:opacity-85"
                            onClick={handleSave}
                        >
                            {t.editModal.save}
                        </button>
                        <button
                            className="flex-1 py-[0.65rem] text-[0.95rem] font-semibold border-none rounded-lg cursor-pointer transition-opacity duration-200 font-[inherit] bg-gray-300 text-text-primary hover:opacity-85"
                            onClick={onClose}
                        >
                            {t.editModal.cancel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
