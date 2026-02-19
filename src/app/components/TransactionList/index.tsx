'use client'

import { useCurrency } from '../../hooks/useCurrency';
import { Transaction } from '../../hooks/useTransactions';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useTranslation } from '../../i18n/LanguageContext';
import * as S from './styles';

interface TransactionListProps {
    transactions: Transaction[];
    handleEdit: (transaction: Transaction) => void;
    handleDelete: (id: string) => void;
    isUpdating: boolean;
    isDeleting: boolean;
}

export const TransactionList = ({ transactions, isDeleting, isUpdating, handleEdit, handleDelete }: TransactionListProps) => {
    const { selectedCurrencyCode } = useCurrency();
    const { t } = useTranslation();

    return (
        <S.TableContainer>
            <S.ResponsiveTable>
                <thead>
                    <tr>
                        <th>{t.transactions.date}</th>
                        <th>{t.transactions.description}</th>
                        <th>{t.transactions.category}</th>
                        <th>{t.transactions.type}</th>
                        <th>{t.transactions.fixed}</th>
                        <th>{t.transactions.amount}</th>
                        <th>{t.transactions.actions}</th>
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
                                    : t.transactions.uncategorized}
                            </td>
                            <td>
                                <S.TypeBadge $type={transaction.type}>
                                    {transaction.type}
                                </S.TypeBadge>
                            </td>
                            <td>
                                {transaction.is_fixed && (
                                    <S.TypeBadge $type="income">
                                        {t.transactions.fixed}
                                    </S.TypeBadge>
                                )}
                            </td>
                            <td>
                                <S.Amount $type={transaction.type}>
                                    {formatCurrency(transaction.amount, selectedCurrencyCode)}
                                </S.Amount>
                            </td>
                            <td>
                                <S.ActionButtons>
                                    <S.EditButton
                                        onClick={() => handleEdit(transaction)}
                                        disabled={isUpdating}
                                    >
                                        {t.transactions.edit}
                                    </S.EditButton>
                                    <S.DeleteButton
                                        onClick={() => handleDelete(transaction._id)}
                                        disabled={isDeleting}
                                    >
                                        {t.transactions.delete}
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