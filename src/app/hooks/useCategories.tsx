'use-cliente'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface Category {
    _id: string;
    name: string;
    createdAt?: Date | string
}

const fetchCategories = async (userId: string): Promise<Category[]> => {
    const response = await fetch(`/api/categories?userId=${userId}`, {
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('Failed to fetch categories');
    }
    return response.json();
};

const addCategory = async ({ name, userId }: { name: string; userId: string }): Promise<Category> => {
    const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, userId }),
    });

    if (!response.ok) {
        throw new Error('Failed to add category');
    }
    return response.json();
};

const updateCategory = async (id: string, name: string): Promise<Category> => {
    const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
    });

    if (!response.ok) {
        throw new Error('Failed to update category');
    }
    return response.json();
};

const deleteCategory = async ({ id }: { id: string }): Promise<string> => {
    const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Failed to delete category');
    }
    return id;
};

export const useCategories = (userId: string) => {
    const queryClient = useQueryClient();

    const STALE_MS = 5 * 60 * 1000; // 5 min

    const { data: categories, isLoading, isError, error } = useQuery<Category[]>({
        queryKey: ['categories', userId],
        queryFn: () => fetchCategories(userId),
        enabled: Boolean(userId),
        staleTime: STALE_MS,
    });

    // Sort the categories alphabetically by name
    const sortedCategories = categories ? [...categories].sort((a, b) => a.name.localeCompare(b.name)) : [];

    const invalidateOnSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['categories', userId] });
        queryClient.invalidateQueries({ queryKey: ['insights'] });
    };

    const addMutation = useMutation<Category, Error, { name: string; userId: string }>({
        mutationFn: addCategory,
        onSuccess: invalidateOnSuccess,
    });

    const updateMutation = useMutation<Category, Error, { id: string, name: string }>({
        mutationFn: ({ id, name }) => updateCategory(id, name),
        onSuccess: invalidateOnSuccess,
    });

    const deleteMutation = useMutation<string, Error, { id: string; userId: string }>({
        mutationFn: deleteCategory,
        onSuccess: invalidateOnSuccess,
    });

    return {
        categories: sortedCategories,
        isLoading,
        isError,
        error,
        addError: addMutation.error,
        addCategory: (name: string) => addMutation.mutateAsync({ name, userId }),
        updateCategory: (id: string, name: string) => updateMutation.mutate({ id, name }),
        deleteCategory: (id: string) => deleteMutation.mutate({ id, userId }),
    };
};