'use client'

import { useQuery } from '@tanstack/react-query';

async function fetchUserData() {
    const response = await fetch('/api/auth/me', {
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user data');
    }

    const data = await response.json();

    // Ensure the response has the expected structure
    if (!data.user && data.isLoggedIn) {
        throw new Error('Invalid user data structure');
    }

    return data.isLoggedIn ? data.user : null;
}

export function useUserData() {
    return useQuery({
        queryKey: ['user'],
        queryFn: fetchUserData,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
        refetchOnWindowFocus: true, // Refresh when window regains focus
    });
}