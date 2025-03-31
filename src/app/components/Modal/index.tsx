import React, { useEffect, useState } from 'react';
import * as S from './styles';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedTransaction: any) => void;
    transaction: any; // Define this type based on your data structure
    categories: any[]; // Categories list
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, transaction, categories }) => {
    const [updatedTransaction, setUpdatedTransaction] = useState(transaction);

    // Update the state whenever the modal is opened (i.e., transaction changes)
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
        onSave(updatedTransaction);
    };

    if (!isOpen) return null; // If modal is not open, return nothing

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
                        value={updatedTransaction.category._id || ''} // Set initial value based on category ID
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