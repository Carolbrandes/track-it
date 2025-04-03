'use client'

import { Transaction } from '../../hooks/useTransactions';
import { formatCurrency, formatDate } from '../../utils/formatters';
import * as S from './styles';

interface TransactionListProps {
    transactions: Transaction[]
    handleEdit: (transaction: Transaction) => void
    handleDelete: (id: string) => void
    isUpdating: boolean
    isDeleting: boolean
}

export const TransactionList = ({ transactions, isDeleting, isUpdating, handleEdit, handleDelete }: TransactionListProps) => {


    return (
        <S.TableContainer>
            <S.ResponsiveTable>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(transaction => (
                        <tr key={transaction._id}>
                            <td>{formatDate(`${transaction.date}`)}</td>
                            <td>{transaction.description}</td>
                            <td>
                                {typeof transaction.category === 'object'
                                    ? transaction.category.name
                                    : 'Uncategorized'}
                            </td>
                            <td>
                                <S.TypeBadge $type={transaction.type}>
                                    {transaction.type}
                                </S.TypeBadge>
                            </td>
                            <td>
                                <S.Amount $type={transaction.type}>
                                    {formatCurrency(transaction.amount, transaction.currency)}
                                </S.Amount>
                            </td>
                            <td>
                                <S.ActionButtons>
                                    <S.EditButton
                                        onClick={() => handleEdit(transaction)}
                                        disabled={isUpdating}
                                    >
                                        Edit
                                    </S.EditButton>
                                    <S.DeleteButton
                                        onClick={() => handleDelete(transaction._id)}
                                        disabled={isDeleting}
                                    >
                                        Delete
                                    </S.DeleteButton>
                                </S.ActionButtons>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </S.ResponsiveTable>
        </S.TableContainer>
    );
};
