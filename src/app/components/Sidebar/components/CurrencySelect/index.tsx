'use client'

import { useEffect, useState } from "react";
import { TfiMoney } from "react-icons/tfi";
import { useCurrency } from '../../../../hooks/useCurrency';
import { useUserData } from '../../../../hooks/useUserData';
import { useTranslation } from '../../../../i18n/LanguageContext';

export const CurrencySelect = () => {
    const { currencies, selectedCurrencyCode, userLoading } = useCurrency();
    const { t } = useTranslation();

    const [selectedCurrency, setSelectedCurrency] = useState<string>(selectedCurrencyCode);


    const [isUpdating, setIsUpdating] = useState(false);
    const { refetch: refetchUser } = useUserData();

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

            if (!response.ok) throw new Error('Update failed');

            const data = await response.json();
            if (!data.success) throw new Error(data.message || 'Currency update failed');

            setSelectedCurrency(newCurrencyId);

            await refetchUser();
        } catch (error) {
            console.error('Update failed:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    useEffect(() => {
        const currencieId = currencies.find(curr => curr.code == selectedCurrencyCode)?._id


        if (currencieId) {
            setSelectedCurrency(currencieId);
        }
    }, [selectedCurrencyCode, currencies]);



    if (userLoading) {
        return <div>{t.currency.loadingUser}</div>;
    }

    return (
        <div className="flex items-center gap-1.5 w-full text-text-primary">
            <TfiMoney />
            <select
                className="flex-1 min-w-0 p-1 border-none text-text-primary text-[0.85rem] bg-transparent cursor-pointer font-[inherit]"
                value={selectedCurrency}
                onChange={handleCurrencyChange}
                disabled={isUpdating}
            >
                <option value="">{t.currency.select}</option>
                {currencies.map((currency) => (
                    <option key={currency._id} value={currency._id}>
                        {currency.name} ({currency.code})
                    </option>
                ))}
            </select>
            {isUpdating && <span className="text-[0.8rem] text-text-secondary">{t.currency.updating}</span>}
        </div>
    );
};
