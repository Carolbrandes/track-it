'use client';
import { useTransactions } from '../hooks/useTransactions';
import { useUserData } from '../hooks/useUserData';
import TransactionForm, { TransactionType } from './components/TransactionForm';
import * as S from './styles';



export default function AddTransaction() {
    const { data: userData } = useUserData();
    const {
        isError,
        error,
        addTransaction,
    } = useTransactions(userData?._id);

    const handleAddTransaction = async (transaction: TransactionType) => { // ✅ Alterado para TransactionType
        console.log("🚀 ~ handleAddTransaction ~ transaction:", transaction);

        const payload = {
            ...transaction,
            date: typeof transaction.date === 'string'
                ? new Date(transaction.date)
                : transaction.date,
            userId: userData?._id, // ✅ Adicionando userId aqui
        };

        await addTransaction(payload); // ✅ Passando payload corretamente
    };

    return (
        <S.PageContainer>

            {isError && <S.ErrorMessage>{error?.message}</S.ErrorMessage>}

            <S.Section>
                <S.SectionTitle>Add New Transaction</S.SectionTitle>
                <TransactionForm onAdd={handleAddTransaction} />
            </S.Section>


        </S.PageContainer>
    );
}