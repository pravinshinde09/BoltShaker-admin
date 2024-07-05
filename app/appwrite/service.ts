import { ID } from "appwrite";
import {
  account,
} from "../appwrite/appWriteConfig"; 
import UserDatabaseService from "../appwriteDB/user_db"; 
type loginPhoneNumberUserAccount = {
  phoneNumber: string;
};

class AppwriteService {
  private account = account;
  private databaseService = new UserDatabaseService();

  async getCurrentUser() {
    try {
      const user = await this.account.get();
      if (user) {
        await this.saveCurrentUserToDatabase(user);
      }
      return user;
    } catch (error) {
      console.log("Appwrite service :: getCurrentUser : ", error);
    }
  }

  async saveCurrentUserToDatabase(user: any) {
    try {
      const userId = user.$id;
      const existingUser = await this.databaseService.getUserProfile(userId);

      if (existingUser) {
        console.log(`User ${userId} already exists in the database.`);
        return;
      }

      const userData = {
        userId: userId,
        email: user.email || "default@example.com",
        name: user.name || "Default Name",
        phoneNumber: user.phone || "0000000000",
        avatar: user.avatar || "defaultAvatarUrl",
      };

      await this.databaseService.saveUserProfile(userId, userData);
      console.log(`User ${userId} saved to database.`);
    } catch (error) {
      console.log("Appwrite service :: saveCurrentUserToDatabase : ", error);
      throw error;
    }
  }

  async loginPhoneNumber({ phoneNumber }: loginPhoneNumberUserAccount) {
    try {
      return await this.account.createPhoneToken(
        ID.unique(),
        phoneNumber
      );
    } catch (error) {
      console.log("Appwrite service :: loginPhoneNumber : ", error);
    }
  }

  async createUserSession(userId: string, secret: string) {
    console.log("userId, secret", userId, secret)
    try {
      return await this.account.createSession(userId, secret);
    } catch (error) {
      console.log("Appwrite service :: createUserSession : ", error);
    }
  }

  async resendOtp(phoneNumber: string) {
    try {
      await this.account.createPhoneToken(ID.unique(), phoneNumber);
      console.log('OTP send successfully.')
    } catch (error) {
      console.log("Appwrite service :: resendOtp : ", error);
    }
  }

  async logout() {
    try {
      await this.account.deleteSession("current");
    } catch (error) {
      alert(error);
      console.log("Appwrite service :: logout : ", error);
    }
  }
}

export default AppwriteService;
