'use client';

import { useEffect, useState } from 'react';
import { TfiMoney } from "react-icons/tfi";
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
    const [selectedCurrency, setSelectedCurrency] = useState('');


    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const response = await fetch('/api/currencies');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json() as DataCurrencies;
                console.log("🚀 ~ fetchCurrencies ~ data:", data)

                if (data.success) {
                    setCurrencies(data.currencies);
                    const defaultCurrency = data.currencies.find((currency) => currency.code === 'USO');
                    if (defaultCurrency) {
                        setSelectedCurrency(defaultCurrency._id);
                    }
                }
            } catch (error) {
                console.error('Error fetching currencies:', error);
            }
        };

        fetchCurrencies();
    }, []);

    const handleCurrencyChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newCurrencyId = event.target.value;
        setSelectedCurrency(newCurrencyId);


        try {
            const response = await fetch('/api/user/update-currency', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: 'user@example.com', currencyId: newCurrencyId }),
            });
            const data = await response.json();
            if (!data.success) {
                console.error('Failed to update currency:', data.message);
            }
        } catch (error) {
            console.error('Error updating currency:', error);
        }
    };

    return (
        <S.CurrencySelect>
            <TfiMoney />
            <select
                value={selectedCurrency}
                onChange={handleCurrencyChange}
            >
                {currencies.map((currency) => (
                    <option key={currency._id} value={currency._id}>
                        {currency.name} ({currency.code})
                    </option>
                ))}
            </select>
        </S.CurrencySelect>
    );
};