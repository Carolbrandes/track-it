import { useQuery } from '@tanstack/react-query';

async function fetchUserData() {
    const response = await fetch('/api/user', {
        credentials: 'include', // Include cookies in the request
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user data');
    }

    return response.json();
}

export function useUserData() {
    return useQuery({
        queryKey: ['user'], // Unique key for the query
        queryFn: fetchUserData, // Function to fetch data
        staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
        retry: 1, // Retry once if the query fails
    });
}