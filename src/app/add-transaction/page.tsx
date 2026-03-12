'use client';
import { useTransactions } from '../hooks/useTransactions';
import { useUserData } from '../hooks/useUserData';
import { useTranslation } from '../i18n/LanguageContext';
import TransactionForm, { TransactionType } from './components/TransactionForm';



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
        <div className="p-4 w-full min-w-0 overflow-x-hidden flex-1 md:p-8 md:max-w-[1400px] md:mx-auto">

            {isError && error?.message !== "Failed to fetch transactions" && <div className="text-danger bg-danger/[0.07] py-3 px-4 rounded-lg mb-4 border border-danger/20 text-[0.9rem]">{error?.message}</div>}

            <section className="mb-8">
                <h2 className="text-[1.1rem] font-semibold mb-4 text-text-secondary uppercase tracking-[0.5px]">{t.transactionForm.addTitle}</h2>
                <TransactionForm onAdd={handleAddTransaction} />
            </section>


        </div>
    );
}
