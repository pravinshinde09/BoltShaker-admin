import { Client, Account, Databases, Storage } from "appwrite";

const APPWRITE_ENDPOINT: string = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!;
const APPWRITE_PROJECT_ID: string = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;
const APPWRITE_DATABASE_ID: string = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const APPWRITE_COLLECTION_ID: string = process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID!;
const APPWRITE_BUCKETS_ID: string = process.env.EXPO_PUBLIC_APPWRITE_BUCKETS_ID!;
const SHAKES_COLLECTION_ID: string = process.env.EXPO_PUBLIC_APPWRITE_SHAKES_COLLECTION_ID!
const OFFERS_COLLECTION_ID: string = process.env.EXPO_PUBLIC_APPWRITE_OFFERS_COLLECTION_ID!

const appwriteClient = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

const account = new Account(appwriteClient);
const databases = new Databases(appwriteClient);
const storage = new Storage(appwriteClient);

export {
  appwriteClient,
  account,
  databases,
  storage,
  APPWRITE_DATABASE_ID,
  APPWRITE_COLLECTION_ID,
  APPWRITE_BUCKETS_ID,
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  SHAKES_COLLECTION_ID,
  OFFERS_COLLECTION_ID
};
