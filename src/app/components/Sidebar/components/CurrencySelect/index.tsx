import { useEffect, useState } from "react";
import { TfiMoney } from "react-icons/tfi";
import { useCurrency } from '../../../../hooks/useCurrency';
import { useUserData } from '../../../../hooks/useUserData';
import * as S from './styles';

export const CurrencySelect = () => {
    const { currencies, selectedCurrencyCode, userLoading } = useCurrency();


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
    }, [selectedCurrencyCode]);



    if (userLoading) {
        return <div>Loading user data...</div>;
    }

    return (
        <S.CurrencySelect>
            <TfiMoney />
            <select
                value={selectedCurrency}
                onChange={handleCurrencyChange}
                disabled={isUpdating}
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