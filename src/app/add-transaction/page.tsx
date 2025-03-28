// app/transactions/page.tsx
'use client';
import { useTransactions } from '../hooks/useTransactions';
import { useUserData } from '../hooks/useUserData';
import TransactionForm from './components/TransactionForm';
import * as S from './styles';

export default function AddTransaction() {
    const { data: userData } = useUserData();
    const {
        isError,
        error,
        addTransaction,
    } = useTransactions(userData?.user?.id);

    const handleAddTransaction = async (transaction: any) => {
        await addTransaction({
            ...transaction,
            userId: userData?.user?.id,
        });
    };

    return (
        <S.PageContainer>
            <S.Title>Manage Transactions</S.Title>

            {isError && <S.ErrorMessage>{error?.message}</S.ErrorMessage>}

            <S.Section>
                <S.SectionTitle>Add New Transaction</S.SectionTitle>
                <TransactionForm onAdd={handleAddTransaction} />
            </S.Section>


        </S.PageContainer>
    );
}