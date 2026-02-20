/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client';

import { Category } from '@/app/hooks/useCategories';
import { useCurrency } from '@/app/hooks/useCurrency';
import React, { useEffect, useState } from 'react';
import { NumberFormatValues } from 'react-number-format';
import { useTranslation } from '../../i18n/LanguageContext';
import { Transaction } from '../../hooks/useTransactions';
import { TransactionToEdit } from '../../page';
import * as S from './styles';

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

    const categoryValue = typeof updatedTransaction.category === 'object'
        ? updatedTransaction.category._id
        : updatedTransaction.category || '';

    return (
        <S.ModalOverlay>
            <S.ModalContainer>
                <S.ModalHeader>
                    <h3>{t.editModal.title}</h3>
                    <S.CloseButton onClick={onClose}>X</S.CloseButton>
                </S.ModalHeader>
                <S.ModalBody>
                    <S.FormGroup>
                        <S.Label>{t.editModal.description}</S.Label>
                        <S.Input
                            type="text"
                            name="description"
                            value={updatedTransaction.description}
                            onChange={handleInputChange}
                        />
                    </S.FormGroup>

                    <S.FormGroup>
                        <S.Label>{t.editModal.selectCategory}</S.Label>
                        <S.Select
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
                        </S.Select>
                    </S.FormGroup>

                    <S.FormGroup>
                        <S.Label>{t.transactionForm.type}</S.Label>
                        <S.Select
                            name="type"
                            value={updatedTransaction.type}
                            onChange={handleInputChange}
                        >
                            <option value="income">{t.editModal.income}</option>
                            <option value="expense">{t.editModal.expense}</option>
                        </S.Select>
                    </S.FormGroup>

                    <S.FormGroup>
                        <S.Label>{t.editModal.amount}</S.Label>
                        <S.StyledNumericFormat
                            value={updatedTransaction.amount}
                            onValueChange={handleAmountChange}
                            thousandSeparator={true}
                            prefix={selectedCurrencyCode + ' '}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            allowNegative={false}
                        />
                    </S.FormGroup>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '4px' }}>
                        <input
                            type="checkbox"
                            checked={updatedTransaction.is_fixed || false}
                            onChange={(e) => setUpdatedTransaction(prev => ({ ...prev, is_fixed: e.target.checked }))}
                            style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                        />
                        {t.transactionForm.fixedTransaction}
                    </label>

                    <S.ButtonGroup>
                        <S.SaveButton onClick={handleSave}>{t.editModal.save}</S.SaveButton>
                        <S.CancelButton onClick={onClose}>{t.editModal.cancel}</S.CancelButton>
                    </S.ButtonGroup>
                </S.ModalBody>
            </S.ModalContainer>
        </S.ModalOverlay>
    );
};

export default Modal;
