import { useAuthContext } from "../appwrite/AppwriteContext";
import { useEffect, useState } from "react";
import TabNavigation from "../navigation/TabNavigation";
import AuthScreenNavigation from "../navigation/AuthScreenNavigation";
import React from "react";
import Loading from "../components/Loading";
import { ImageBackground, StyleSheet } from "react-native";

const Router = () => {
  const { appwrite, isLoggedIn, setIsLoggedIn } = useAuthContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appwrite
      .getCurrentUser()
      .then((response) => {
        setIsLoggedIn(false);
        if (response) {
          setIsLoggedIn(true);
        }
        setLoading(false);
      })
      .catch((_) => {
        setIsLoggedIn(false);
        setLoading(false);
      });
  }, [appwrite, setIsLoggedIn]);

  if (loading) {
    return (
      <ImageBackground source={require('../../assets/BoltShakerLogo.png')} style={styles.background}>
        <Loading />
      </ImageBackground>
    );
  }

  return isLoggedIn ? <TabNavigation /> : <AuthScreenNavigation />;
};

export default Router;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "cover",
  },
});
