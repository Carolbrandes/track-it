import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface Transaction {
    _id: string;
    description: string;
    amount: number;
    currency: string;
    date: Date;
    type: 'expense' | 'income';
    category: string;
}

const fetchTransactions = async (userId: string): Promise<Transaction[]> => {
    const response = await fetch(`/api/transactions?userId=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch transactions');
    return response.json();
};

const addTransaction = async (transaction: Omit<Transaction, '_id'>): Promise<Transaction> => {
    const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
    });
    if (!response.ok) throw new Error('Failed to add transaction');
    return response.json();
};

export const useTransactions = (userId: string) => {
    const queryClient = useQueryClient();

    const { data, isLoading, isError, error } = useQuery<Transaction[]>({
        queryKey: ['transactions', userId],
        queryFn: () => fetchTransactions(userId),
        enabled: !!userId,
    });

    const addMutation = useMutation({
        mutationFn: addTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions', userId] });
        },
    });

    return {
        transactions: data || [],
        isLoading,
        isError,
        error,
        addTransaction: (transaction: Omit<Transaction, '_id'>) => addMutation.mutate(transaction),
    };
};