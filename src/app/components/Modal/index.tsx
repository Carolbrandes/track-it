'use client';

import { Category } from '@/app/hooks/useCategories';
import React, { useEffect, useState } from 'react';
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
        let categoryToSave: string | CategoryObj;

        if (typeof updatedTransaction.category === 'string') {
            categoryToSave = updatedTransaction.category;
        } else {
            const categoryObj = updatedTransaction.category || {};
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
                    <h3>Edit Transaction</h3>
                    <S.CloseButton onClick={onClose}>X</S.CloseButton>
                </S.ModalHeader>
                <S.ModalBody>
                    <S.Input
                        type="text"
                        name="description"
                        value={updatedTransaction.description}
                        onChange={handleInputChange}
                        placeholder="Description"
                    />
                    <S.Select
                        name="category"
                        value={categoryValue}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Category</option>
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
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </S.Select>
                    <S.Input
                        type="number"
                        name="amount"
                        value={updatedTransaction.amount}
                        onChange={handleInputChange}
                        placeholder="Amount"
                    />
                    <S.Button onClick={handleSave}>Save</S.Button>
                    <S.Button onClick={onClose}>Cancel</S.Button>
                </S.ModalBody>
            </S.ModalContainer>
        </S.ModalOverlay>
    );
};

export default Modal;
