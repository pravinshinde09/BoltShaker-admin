import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

interface CurrencyContextType {
    currency: string;
    changeCurrency: (newCurrency: string) => Promise<void>;
    formatPrice: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType>({
    currency: 'USD',
    changeCurrency: async () => {}, 
    formatPrice: (amount) => `$${amount.toFixed(2)}`,
});

export const useCurrency = () => {
    const [currency, setCurrency] = useState('USD');
    const { getItem, setItem } = useAsyncStorage('@currency');

    useEffect(() => {
        const fetchCurrency = async () => {
            const savedCurrency = await getItem();
            if (savedCurrency) {
                setCurrency(savedCurrency);
            }
        };
        fetchCurrency();
    }, []);

    const changeCurrency = async (newCurrency: string) => {
        setCurrency(newCurrency);
        await setItem(newCurrency);
    };

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
        }).format(amount);
    };

    return { currency, changeCurrency, formatPrice };
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }: any) => {
    const { currency, changeCurrency, formatPrice } = useCurrency();

    return (
        <CurrencyContext.Provider value={{ currency, changeCurrency, formatPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrencyContext = () => useContext(CurrencyContext);