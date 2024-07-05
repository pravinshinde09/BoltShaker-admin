import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Models } from 'appwrite';
import { databases, APPWRITE_DATABASE_ID, SHAKES_COLLECTION_ID } from '../appwrite/appWriteConfig';
import { useLanguage } from './LocalizationContext';
import { ShakesType } from '../types/shakeDetailsTypes';

type ItemData = {
    shakes: ShakesType[];
}

type ShakeContextType = {
    isLoading: boolean,
    filterShakes: ShakesType[],
    searchTerm: string,
    setSearchTerm: (term: string) => void;
}

const ShakeContext = createContext<ShakeContextType>({
    isLoading: true,
    filterShakes: [],
    searchTerm: '',
    setSearchTerm: () => { },
});

export const ShakeProvider = ({ children }: any) => {
    const [localeBasedShakes, setLocalBasedShakes] = useState<Models.Document[][0]>();
    const [isLoading, setIsLoading] = useState(true);
    const [itemData, setItemData] = useState<ItemData>({ shakes: [] });
    const [searchTerm, setSearchTerm] = useState('');
    const { locale } = useLanguage();

    // Fetch the list of Shakes JSON file URLs from the AppWrite database.
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await databases.listDocuments<Models.Document>(APPWRITE_DATABASE_ID, SHAKES_COLLECTION_ID);
                setLocalBasedShakes(response.documents[0]);
            } catch (error) {
                console.error("Database error:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Fetch the actual Shakes data from the URL provided in the database for the current locale.
    useEffect(() => {
        const fetchItemData = async () => {
            try {
                const fetchedData = await fetch(localeBasedShakes?.[locale]).then(response => response.json());
                setItemData(fetchedData);
            } catch (error) {
                console.error("Fetch item data error:", error);
            }
        };

        if (!!localeBasedShakes) {
            fetchItemData();
        }
    }, [localeBasedShakes, locale]);

    const filterShakes = useMemo(() =>
        itemData.shakes ? itemData.shakes.filter((shake: ShakesType) =>
            shake.title.toLowerCase().includes(searchTerm.toLowerCase())
        ) : [], [itemData, searchTerm]);


    return (
        <ShakeContext.Provider value={{ isLoading, filterShakes, searchTerm, setSearchTerm }}>
            {children}
        </ShakeContext.Provider>
    );
};

export const useShakesContext = () => useContext(ShakeContext);
