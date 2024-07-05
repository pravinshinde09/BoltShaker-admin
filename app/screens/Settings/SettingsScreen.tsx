import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
} from "react-native";
import { SPACING } from "../../theme";
import Button from "../../components/Button";
import { useLanguage } from "../../context/LocalizationContext";
import { ScrollView } from "react-native-gesture-handler";
import PersonalDetails from "../../components/PersonalDetails";
import Setting from "../../components/Setting";
import Security from "../../components/Security";
import { useAuthContext } from "../../appwrite/AppwriteContext";
import { type StyleProps, useTheme } from "../../context/ThemeProvider";
import DatabaseService from '../../appwriteDB/user_db'

type UserObj = {
  id: string,
  name?: string;
  email?: string;
  phoneNumber?: string;
  avatar?:string
  deleteToken?: string; 
}

const SettingsScreen = () => {
  const databaseService = new DatabaseService();
  const { appwrite, setIsLoggedIn } = useAuthContext();
  const [userData, setUserData] = useState<UserObj>({
    id:'',
    name: '',
    email: '',
    phoneNumber: '',
    avatar: '',
    deleteToken: ''
  });
  const handleSignOut = useCallback(async () => {
    try {
      await appwrite.logout()
        .then(() => {
          setIsLoggedIn(false)
        })
    } catch (error) {
    }
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = await appwrite.getCurrentUser();
        if (user) {
          const userProfile = await databaseService.getUserProfile(user.$id);
          if (userProfile) {
            const userObj: UserObj = {
              id: userProfile.$id,
              name: userProfile.name || '',
              email: userProfile.email || '',
              phoneNumber: userProfile.phoneNumber || '',
              avatar: userProfile.avatar || '',
              deleteToken: userProfile. deleteToken || '',
            };
            setUserData(userObj);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditProfile = async (updatedData: Partial<UserObj>) => {
    const updatedUserData = { ...userData, ...updatedData };
    setUserData(updatedUserData);

    try {
      await databaseService.editUserProfile(updatedUserData.id, updatedUserData);
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const { translate } = useLanguage();
  const { colors } = useTheme();
  const styles = getStyles({ colors });

  return (
    <ScrollView>
      <View style={styles.container}>
        <PersonalDetails userData={userData} onUpdateProfile={handleEditProfile } />
        <View style={styles.mainDivider} />
        <Setting />
        <View style={styles.mainDivider} />
        <Security />
        <View style={styles.mainDivider} />
        <View style={styles.profileActions}>
          <Button onPress={handleSignOut} variant="primary" fullwidth>
            {translate("sign_out")}
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const getStyles = ({ colors }: StyleProps) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginTop: SPACING.spacing02,
      paddingHorizontal: SPACING.spacing03,
      paddingTop: SPACING.spacing03,
      gap: SPACING.spacing03,
      backgroundColor: colors.background,
    },
    profileActions: {
      marginVertical: SPACING.spacing03,
      marginBottom: SPACING.spacing05,
    },
    mainDivider: {
      borderBottomWidth: 1,
      borderBottomColor: colors.icon,
      width: "100%",
    },
  });

export default SettingsScreen;
