/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client';

import { Category } from '@/app/hooks/useCategories';
import React, { useEffect, useState } from 'react';
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

interface CategoryObj {
    _id: string;
    name: string;
    userId: string;
    createdAt: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, transaction, categories }) => {
    const { t } = useTranslation();
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

    const handleSave = () => {
        let categoryToSave: string | CategoryObj | null;

        if (typeof updatedTransaction.category === 'string') {
            categoryToSave = updatedTransaction.category;
        } else {
            const categoryObj = updatedTransaction.category;
            const selectedCategory = categories.find(cat => cat._id === categoryObj._id);

            categoryToSave = {
                _id: categoryObj._id || selectedCategory?._id || '',
                name: categoryObj.name || selectedCategory?.name || '',
                userId: updatedTransaction.userId,
                createdAt: String((categoryObj && 'createdAt' in categoryObj && categoryObj.createdAt instanceof Date)
                    ? categoryObj.createdAt.toISOString()
                    : (categoryObj && 'createdAt' in categoryObj ? categoryObj.createdAt : new Date().toISOString()))

            };
        }

        const transactionToSave: TransactionToEdit = {
            ...updatedTransaction,
            category: categoryToSave
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
                    <S.Input
                        type="text"
                        name="description"
                        value={updatedTransaction.description}
                        onChange={handleInputChange}
                        placeholder={t.editModal.description}
                    />
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
                    <S.Select
                        name="type"
                        value={updatedTransaction.type}
                        onChange={handleInputChange}
                    >
                        <option value="income">{t.editModal.income}</option>
                        <option value="expense">{t.editModal.expense}</option>
                    </S.Select>
                    <S.Input
                        type="number"
                        name="amount"
                        value={updatedTransaction.amount}
                        onChange={handleInputChange}
                        placeholder={t.editModal.amount}
                    />
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '10px' }}>
                        <input
                            type="checkbox"
                            checked={updatedTransaction.is_fixed || false}
                            onChange={(e) => setUpdatedTransaction(prev => ({ ...prev, is_fixed: e.target.checked }))}
                            style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                        />
                        {t.transactionForm.fixedTransaction}
                    </label>
                    <S.Button onClick={handleSave}>{t.editModal.save}</S.Button>
                    <S.Button onClick={onClose}>{t.editModal.cancel}</S.Button>
                </S.ModalBody>
            </S.ModalContainer>
        </S.ModalOverlay>
    );
};

export default Modal;
