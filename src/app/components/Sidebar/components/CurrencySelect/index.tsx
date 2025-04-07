'use client';

import { useEffect, useState } from 'react';
import { TfiMoney } from "react-icons/tfi";
import { useUserData } from '../../../../hooks/useUserData';
import * as S from './styles';

interface CurrencyProps {
    _id: string
    name: string
    code: string
}

interface DataCurrencies {
    success: boolean
    currencies: CurrencyProps[]
}

export const CurrencySelect = () => {
    const [currencies, setCurrencies] = useState<CurrencyProps[]>([]);
    const [selectedCurrency, setSelectedCurrency] = useState<string>('');
    const [isUpdating, setIsUpdating] = useState(false);
    const { data: userData, isLoading: userLoading, refetch: refetchUser } = useUserData();

    // Initialize selectedCurrency when userData is available
    useEffect(() => {
        if (userData?.currencyId) {
            setSelectedCurrency(userData.currencyId);
        } else {
            setSelectedCurrency(''); // Reset if no currency selected
        }
    }, [userData?.currencyId]);

    // Fetch available currencies
    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const response = await fetch('/api/currencies');
                if (!response.ok) throw new Error('Failed to fetch currencies');

                const data: DataCurrencies = await response.json();

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

    const handleCurrencyChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newCurrencyId = event.target.value;
        if (!newCurrencyId) return;

        setIsUpdating(true);

        try {
            const response = await fetch('/api/user/update-currency', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ currencyId: newCurrencyId }),
            });

            if (!response.ok) {
                throw new Error('Update failed');
            }

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || 'Currency update failed');
            }

            // Update local state and refetch user data
            setSelectedCurrency(newCurrencyId);
            await refetchUser();
        } catch (error) {
            console.error('Update failed:', error);
            // Revert to previous value if update fails
            if (userData?.currencyId) {
                setSelectedCurrency(userData.currencyId);
            }
        } finally {
            setIsUpdating(false);
        }
    };

    if (userLoading) {
        return <div>Loading user data...</div>;
    }

    return (
        <S.CurrencySelect>
            <TfiMoney />
            <select
                value={selectedCurrency}
                onChange={handleCurrencyChange}
                disabled={isUpdating || !userData}
            >
                <option value="">Select currency</option>
                {currencies.map((currency) => (
                    <option key={currency._id} value={currency._id}>
                        {currency.name} ({currency.code})
                    </option>
                ))}
            </select>
            {isUpdating && <span>Updating...</span>}
        </S.CurrencySelect>
    );
};