'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface Transaction {
    _id: string;
    description: string;
    amount: number;
    currency: string;
    date: Date;
    type: 'expense' | 'income';
    is_fixed?: boolean | null;
    category: string | { _id: string; name: string, createdAt?: Date | string };
    userId: string;
}

interface TransactionFilters {
    description?: string;
    category?: string;
    type?: string;
    minAmount?: string;
    maxAmount?: string;
    startDate?: string;
    endDate?: string;
}

interface TransactionResponse {
    data: Transaction[];
    totalCount: number;
    totalPages: number;
}

const fetchTransactions = async (
    userId: string,
    page: number = 1,
    limit: number = 10,
    filters: TransactionFilters = {}
): Promise<TransactionResponse> => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters.description && { description: filters.description }),
        ...(filters.category && { category: filters.category }),
        ...(filters.type && { type: filters.type }),
        ...(filters.minAmount && { minAmount: filters.minAmount }),
        ...(filters.maxAmount && { maxAmount: filters.maxAmount }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
    });

    const response = await fetch(`/api/transactions?userId=${userId}&${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch transactions');
    return response.json();
};

const fetchAllTransactions = async (
    userId: string,
    page: number = 1,
    filters: TransactionFilters = {}
): Promise<TransactionResponse> => {
    const stringFilters = Object.fromEntries(
        Object.entries(filters).map(([key, value]) => [key, String(value)])
    );

    const totalResponse = await fetch(`/api/transactions?userId=${userId}&${new URLSearchParams(stringFilters).toString()}`);

    if (!totalResponse.ok) throw new Error('Failed to fetch total transactions');

    const totalData = await totalResponse.json();
    const totalCount = totalData.totalCount;

    const params = new URLSearchParams({
        page: page.toString(),
        limit: totalCount.toString(), // Set limit to total transactions count
        ...(filters.description && { description: filters.description }),
        ...(filters.category && { category: filters.category }),
        ...(filters.type && { type: filters.type }),
        ...(filters.minAmount && { minAmount: filters.minAmount }),
        ...(filters.maxAmount && { maxAmount: filters.maxAmount }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
    });

    const response = await fetch(`/api/transactions?userId=${userId}&${params.toString()}`);
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

const updateTransaction = async ({ id, ...transaction }: { id: string } & Partial<Transaction>): Promise<Transaction> => {
    const response = await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
    });
    if (!response.ok) throw new Error('Failed to update transaction');
    return response.json();
};

const deleteTransaction = async (id: string): Promise<string> => {
    const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete transaction');
    return id;
};

export const useTransactions = (
    userId: string,
    page: number = 1,
    limit: number = 10,
    filters: TransactionFilters = {}
) => {
    const queryClient = useQueryClient();

    const STALE_MS = 5 * 60 * 1000; // 5 min — dados considerados frescos; refetch após mutação

    const {
        data: transactionsData,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ['transactions', userId, page, limit, filters],
        queryFn: () => fetchTransactions(userId, page, limit, filters),
        enabled: Boolean(userId),
        placeholderData: (previousData) => previousData,
        staleTime: STALE_MS,
    });

    const { data: allTransactionsData } = useQuery({
        queryKey: ['allTransactions', userId, filters],
        queryFn: () => fetchAllTransactions(userId, 1, filters),
        enabled: Boolean(userId),
        staleTime: STALE_MS,
    });

    const invalidateOnSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['transactions', userId] });
        queryClient.invalidateQueries({ queryKey: ['allTransactions', userId] });
        queryClient.invalidateQueries({ queryKey: ['insights'] });
    };

    const addMutation = useMutation({
        mutationFn: addTransaction,
        onSuccess: invalidateOnSuccess,
    });

    const updateMutation = useMutation({
        mutationFn: updateTransaction,
        onSuccess: invalidateOnSuccess,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTransaction,
        onSuccess: invalidateOnSuccess,
    });

    return {
        transactions: transactionsData?.data || [],
        allTransactions: allTransactionsData?.data || [],
        totalCount: transactionsData?.totalCount || 0,
        totalPages: transactionsData?.totalPages || 1,
        isLoading,
        isError,
        error,
        addTransaction: (transaction: Omit<Transaction, '_id'>) =>
            addMutation.mutateAsync(transaction),
        updateTransaction: (id: string, transaction: Partial<Transaction>) =>
            updateMutation.mutateAsync({ id, ...transaction }),
        deleteTransaction: (id: string) =>
            deleteMutation.mutateAsync(id),
        isAdding: addMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};