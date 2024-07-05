import { Client, Databases,Storage, Query } from 'appwrite';
import {APPWRITE_ENDPOINT,APPWRITE_PROJECT_ID, APPWRITE_DATABASE_ID} from '../appwrite/appWriteConfig' 

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT) 
  .setProject(APPWRITE_PROJECT_ID); 

const databases = new Databases(client);
const storage = new Storage(client);

const databaseId = APPWRITE_DATABASE_ID; 
const collectionId = '66853fac003decb9c180'; 
const bucketId = '6673cba400009f844021';

export const createProduct = async (product: any) => {
  try {
    const response = await databases.createDocument(databaseId, collectionId, 'unique()', product);
    return response;
  } catch (error) {
    console.error('Error creating product:', error);
  }
};


export const getProduct = async (productId: string) => {
  try {
    const response = await databases.getDocument(databaseId, collectionId, productId);
    return response;
  } catch (error) {
    console.error('Error getting product:', error);
  }
};

export const updateProduct = async (productId: string, updatedData: any) => {
  try {
    const response = await databases.updateDocument(databaseId, collectionId, productId, updatedData);
    return response;
  } catch (error) {
    console.error('Error updating product:', error);
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const response = await databases.deleteDocument(databaseId, collectionId, productId);
    return response;
  } catch (error) {
    console.error('Error deleting product:', error);
  }
};

export const listProducts = async (userId: string) => {
  try {
    const response = await databases.listDocuments(databaseId, collectionId, [
      Query.equal('userId', userId),
    ]);
    return response.documents;
  } catch (error) {
    console.error('Error listing products:', error);
  }
};

export const uploadImage = async ({imageUri}:any) => {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const fileName = imageUri.split('/').pop() || `image-${Date.now()}.jpg`;
    const file = new File([blob], fileName, { type: blob.type });

    const uploadResponse = await storage.createFile(bucketId, 'unique()', file);
    const fileUrl = storage.getFilePreview(bucketId, uploadResponse.$id);

    return fileUrl.href;
  } catch (error) {
    console.error('Error uploading image:', error);
    return '';
  }
};
