'use client';

import { useEffect, useState } from 'react';
import { useUserData } from './useUserData';

interface Currency {
    _id: string;
    name: string;
    code: string;
}

interface CurrencyResponse {
    success: boolean;
    currencies: Currency[];
}

export const useCurrency = () => {
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>('USD');

    const { data: userData, isLoading: userLoading } = useUserData();

    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const response = await fetch('/api/currencies');
                if (!response.ok) throw new Error('Failed to fetch currencies');

                const data: CurrencyResponse = await response.json();
                if (data.success) {
                    const sortedCurrencies = [...data.currencies].sort((a, b) =>
                        a.name.localeCompare(b.name)
                    );
                    setCurrencies(sortedCurrencies);
                }
            } catch (error) {
                console.error('Currency fetch error:', error);
            }
        };

        fetchCurrencies();
    }, []);

    useEffect(() => {
        if (userData?.currencyId && currencies.length > 0) {
            const selectedCurrency = currencies.find(c => c._id === userData.currencyId);
            if (selectedCurrency) {
                setSelectedCurrencyCode(selectedCurrency.code);
            }
        }
    }, [userData?.currencyId, currencies]);

    return { currencies, selectedCurrencyCode, userLoading };
};