import { AppwriteException, ID } from "appwrite";
import { account, APPWRITE_COLLECTION_ID, APPWRITE_DATABASE_ID, databases, storage } from "../appwrite/appWriteConfig"; 

export type UserProfileData = {
  userId: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  avatar?: string;
};

class UserDatabaseService {

  async checkSession() {
    try {
      const session = await account.get();
      return session;
    } catch (error) {
      console.error('Error checking session:', error);
      return null;
    }
  }

  async getUserProfile(userId: string): Promise<any | null> {
    try {
      const session = await this.checkSession();
      if (!session) {
        throw new Error("User is not authenticated");
      }

      const response = await databases.getDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ID,
        userId
      );
      return response;
    } catch (error) {
      if (error instanceof AppwriteException && error.message.includes("Document with the requested ID could not be found")) {
        return null;
      }
      console.log("DatabaseService :: getUserProfile : ", error);
      throw error;
    }
  }

  async saveUserProfile(userId: string, userData: UserProfileData): Promise<void> {
    try {
      const session = await this.checkSession();
      if (!session) {
        throw new Error("User is not authenticated");
      }
      await databases.createDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ID,
        userId,
        userData
      );
      console.log(`User ${userId} saved to database.`);
    } catch (error) {
      console.log("DatabaseService :: saveUserToDatabase : ", error);
      throw error;
    }
  }

  async editUserProfile(userId: string, updatedData: Partial<UserProfileData>): Promise<void> {
    try {
      const session = await this.checkSession();
      if (!session) {
        throw new Error("User is not authenticated");
      }
      const existingData = await this.getUserProfile(userId);
      if (!existingData) {
        throw new Error(`User with ID ${userId} not found`);
      }
  
      const validFields: (keyof UserProfileData)[] = ["name", "email", "phoneNumber", "avatar"];
      const filteredData: Partial<UserProfileData> = {};
      
      for (const key in updatedData) {
        if (validFields.includes(key as keyof UserProfileData)) {
          filteredData[key as keyof UserProfileData] = updatedData[key as keyof UserProfileData];
          console.log("updated Data: ", updatedData);
        }
      }
  
      await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ID,
        userId,
        filteredData 
      );
  
      console.log(`User profile updated for ${userId}`);
    } catch (error) {
      console.error("DatabaseService :: editUserProfile : ", error);
      throw error;
    }
  }

  // async uploadAvatar(fileUri: string): Promise<string> {
  //   console.log("fileUris:", fileUri);
  //   try {
  //     const session = await this.checkSession();
  //     if (!session) {
  //       throw new Error("User is not authenticated");
  //     }
  //     const response = await fetch(fileUri);
  //     const blob = await response.blob();
  //     const file = new File([blob], `avatar_${Date.now()}.jpg`, { type: blob.type });
  //     console.log(`file:`, file);
  //     const result = await storage.createFile(APPWRITE_BUCKETS_ID, ID.unique(), file);
  //     console.log(`object_result:`, result);
  //     console.log("Upload successful:", result);
  //     return result.$id;
  //   } catch (error) {
  //     console.error("DatabaseService :: uploadAvatar : ", error);
  //     if (error instanceof AppwriteException && error.message.includes("401")) {
  //       console.error("Unauthorized error, user might be logged out.");
  //     }
  //     throw error;
  //   }
  // }

  // async getAvatarUrl(fileId: string): Promise<string> {
  //   try {
  //     console.log("Fetching avatar URL...");
  //     const result = await storage.getFileView(APPWRITE_BUCKETS_ID, fileId);
  //     console.log("Avatar URL fetched:", result.href);
  //     return result.href;
  //   } catch (error) {
  //     console.error("DatabaseService :: getAvatarUrl : ", error);
  //     throw error;
  //   }
  // }
}

export default UserDatabaseService;
