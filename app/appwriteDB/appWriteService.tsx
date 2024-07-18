import { Client, Databases, Query } from 'appwrite';
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_DATABASE_ID } from '../appwrite/appWriteConfig';

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

const databases = new Databases(client);

const databaseId = APPWRITE_DATABASE_ID;
const productsCollectionId = '66853fac003decb9c180'; 
const nutritionalDetailsCollectionId = '668e237f001e5af0c3c6'; 
const bucketId = '6673cba400009f844021'; 

export const createProduct = async (product: any) => {
  try {
    const response = await databases.createDocument(databaseId, productsCollectionId, 'unique()', product);
    return response;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const getProduct = async (productId: string) => {
  try {
    const response = await databases.getDocument(databaseId, productsCollectionId, productId);
    return response;
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

export const updateProduct = async (productId: string, updatedData: any) => {
  try {
    const response = await databases.updateDocument(databaseId, productsCollectionId, productId, updatedData);
    return response;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const response = await databases.deleteDocument(databaseId, productsCollectionId, productId);
    return response;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const listProducts = async (userId: string) => {
  try {
    const response = await databases.listDocuments(databaseId, productsCollectionId, [
      Query.equal('userId', userId),
    ]);
    return response.documents;
  } catch (error) {
    console.error('Error listing products:', error);
    throw error;
  }
};

export const createNutritionalDetails = async (detailsData: any) => {
  try {
    const response = await databases.createDocument(databaseId, nutritionalDetailsCollectionId, 'unique()', {
      size: detailsData.size || '',
      calories: detailsData.calories || '',
      fat: detailsData.fat || '',
      carbs: detailsData.carbs || '',
      proteins: detailsData.proteins || '',
      salt: detailsData.salt || '',
    });
    return response;
  } catch (error) {
    console.error('Error creating nutritional details:', error);
    throw error;
  }
};


export const getNutritionalDetailsById = async (detailsId: string) => {
  try {
    const response = await databases.getDocument(databaseId, nutritionalDetailsCollectionId, detailsId);
    return response;
  } catch (error) {
    console.error('Error getting nutritional details:', error);
    throw error;
  }
};

export const updateNutritionalDetails = async (detailsId: string , updatedData: any) => {
  try{
    const response = await databases.updateDocument(databaseId, nutritionalDetailsCollectionId, detailsId, updatedData)
    return response;
  } catch (error) {
    console.error('Error updating nutritional details:', error);
    throw error;
  }
};

export const deleteNutritionalDetails = async (detailsId: string) => {
  try {
    const response = await databases.deleteDocument(databaseId, nutritionalDetailsCollectionId, detailsId)
    return response;
  } catch (error) {
    console.log('Error delete nutritional details:', error);
    throw error;
  }
}