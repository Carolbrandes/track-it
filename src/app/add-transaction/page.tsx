'use client';
import { useTransactions } from '../hooks/useTransactions';
import { useUserData } from '../hooks/useUserData';
import { useTranslation } from '../i18n/LanguageContext';
import TransactionForm, { TransactionType } from './components/TransactionForm';
import * as S from './styles';



export default function AddTransaction() {
    const { t } = useTranslation();
    const { data: userData } = useUserData();
    const {
        isError,
        error,
        addTransaction,
    } = useTransactions(userData?._id);

    const handleAddTransaction = async (transaction: TransactionType) => {

        const payload = {
            ...transaction,
            date: typeof transaction.date === 'string'
                ? new Date(transaction.date)
                : transaction.date,
            userId: userData?._id,
        };

        await addTransaction(payload);
    };

    return (
        <S.PageContainer>

            {isError && error?.message !== "Failed to fetch transactions" && <S.ErrorMessage>{error?.message}</S.ErrorMessage>}

            <S.Section>
                <S.SectionTitle>{t.transactionForm.addTitle}</S.SectionTitle>
                <TransactionForm onAdd={handleAddTransaction} />
            </S.Section>


        </S.PageContainer>
    );
}