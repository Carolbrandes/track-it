'use client';

import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { NumberFormatValues } from 'react-number-format';
import { Category } from '../../hooks/useCategories';
import { useCurrency } from '../../hooks/useCurrency';
import { useTranslation } from '../../i18n/LanguageContext';
import CategoryAutocomplete from '../CategoryAutocomplete';
import * as S from '../Modal/styles';

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
        const newCat = await addCategory(name);
        if (newCat?._id) {
            setCategoryId(newCat._id);
            return newCat;
        }
    };

    if (!isOpen) return null;

    return (
        <S.ModalOverlay>
            <S.ModalContainer>
                <S.ModalHeader>
                    <h3>{t.transactionForm.addTitle}</h3>
                    <S.CloseButton onClick={handleClose}>✕</S.CloseButton>
                </S.ModalHeader>
                <S.ModalBody>
                    <S.FormGroup>
                        <S.Label>{t.transactionForm.description}</S.Label>
                        <S.Input
                            type="text"
                            placeholder={t.transactionForm.descriptionPlaceholder}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </S.FormGroup>

                    <S.FormGroup>
                        <S.Label>{t.transactionForm.amount}</S.Label>
                        <S.StyledNumericFormat
                            value={amount}
                            onValueChange={handleAmountChange}
                            thousandSeparator
                            prefix={selectedCurrencyCode + ' '}
                            decimalScale={2}
                            fixedDecimalScale
                            allowNegative={false}
                            placeholder="0.00"
                        />
                    </S.FormGroup>

                    <S.FormGroup>
                        <S.Label>{t.transactionForm.date}</S.Label>
                        <S.Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </S.FormGroup>

                    <S.FormGroup>
                        <S.Label>{t.transactionForm.type}</S.Label>
                        <S.Select
                            value={type}
                            onChange={(e) => setType(e.target.value as 'expense' | 'income')}
                        >
                            <option value="expense">{t.editModal.expense}</option>
                            <option value="income">{t.editModal.income}</option>
                        </S.Select>
                    </S.FormGroup>

                    <S.FormGroup>
                        <S.Label>{t.transactionForm.category}</S.Label>
                        <CategoryAutocomplete
                            categories={categories}
                            selectedId={categoryId}
                            onSelect={(id) => setCategoryId(id)}
                            onCreateNew={handleCreateCategory}
                        />
                    </S.FormGroup>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '4px' }}>
                        <input
                            type="checkbox"
                            checked={isFixed}
                            onChange={(e) => setIsFixed(e.target.checked)}
                            style={{ width: '1.1rem', height: '1.1rem', cursor: 'pointer', accentColor: 'var(--primary)' }}
                        />
                        {t.transactionForm.fixedTransaction}
                    </label>

                    {error && (
                        <div style={{ color: '#ef4444', fontSize: '0.85rem' }}>{error}</div>
                    )}

                    <S.ButtonGroup>
                        <S.SaveButton onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? t.transactionForm.adding : t.transactionForm.addButton}
                        </S.SaveButton>
                        <S.CancelButton onClick={handleClose}>
                            {t.editModal.cancel}
                        </S.CancelButton>
                    </S.ButtonGroup>
                </S.ModalBody>
            </S.ModalContainer>
        </S.ModalOverlay>
    );
};

export default AddTransactionModal;
