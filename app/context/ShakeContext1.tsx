import React, { createContext, useContext, useState, useEffect } from 'react';
import { listProducts, getNutritionalDetailsById } from '../appwriteDB/appWriteService';
import { account } from '../appwrite/appWriteConfig';
import { Models } from 'appwrite';

type NutritionalDetails = {
  size: string;
  calories: string;
  fat: string;
  carbs: string;
  proteins: string;
  salt: string;
};

type ContextType = {
  userId: string;
  products: Models.Document[];
  nutritionalDetailsMap: { [key: string]: NutritionalDetails };
  fetchProducts: () => void;
  loading: boolean;
};

const ShakesContext = createContext<ContextType | undefined>(undefined);

export const useShakes = () => {
  const context = useContext(ShakesContext);
  if (!context) {
    throw new Error('useShakes must be used within a ShakesProvider');
  }
  return context;
};

const ShakesProvider1 = ({ children }: any) => {
  const [userId, setUserId] = useState<string>('');
  const [products, setProducts] = useState<Models.Document[]>([]);
  const [nutritionalDetailsMap, setNutritionalDetailsMap] = useState<{ [key: string]: NutritionalDetails }>({});
  const [loading, setLoading] = useState<boolean>(true); // Initialize loading state

  const fetchNutritionalDetails = async (nutritionalDetailsId: string) => {
    try {
      const response = await getNutritionalDetailsById(nutritionalDetailsId);
      if (response) {
        const nutritionalDetailsData: NutritionalDetails = {
          size: response.size || '',
          calories: response.calories || '',
          fat: response.fat || '',
          carbs: response.carbs || '',
          proteins: response.proteins || '',
          salt: response.salt || '',
        };
        return nutritionalDetailsData;
      }
    } catch (error) {
      console.log('Error fetching Nutritional Details:', error);
    }
    return null;
  };

  const fetchProducts = async () => {
    setLoading(true); // Set loading to true before fetching

    try {
      const user = await account.get();
      if (user) {
        setUserId(user.$id);
        const response = await listProducts(user.$id);
        if (response) {
          setProducts(response);

          // Fetch and map nutritional details for each product
          const detailsMap: { [key: string]: NutritionalDetails } = {};
          for (const product of response) {
            if (product.nutritionalDetailsId) {
              const detailsResponse = await fetchNutritionalDetails(product.nutritionalDetailsId);
              if (detailsResponse) {
                detailsMap[product.$id] = detailsResponse;
              }
            }
          }
          setNutritionalDetailsMap(detailsMap);
        }
      }
    } catch (error) {
      console.log('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const contextValues: ContextType = {
    userId,
    products,
    nutritionalDetailsMap,
    fetchProducts,
    loading,
  };

  return (
    <ShakesContext.Provider value={contextValues}>
      {children}
    </ShakesContext.Provider>
  );
};

export default ShakesProvider1;
