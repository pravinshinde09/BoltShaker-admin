import React from "react";
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { ParamListBase } from '@react-navigation/native';
import { HomeIcon, MapIcon, OfferIcon } from '../assets';
import StackNavigation from './HomeScreenNavigation';
import MachineLocation from '../screens/MachineLocation/MachineLocation';
import OfferScreenNavigation from './OfferScreenNavigation';
import { useTheme } from '../context/ThemeProvider';

export type RootStackParamList = {
  HomeScreen: undefined;
  Map: undefined;
  Offer: undefined;
};

const Tab = createBottomTabNavigator<RootStackParamList>();

const BottomNavigator = () => {
  const { colors } = useTheme();

  const handleTabPress = (
    routeName: keyof RootStackParamList,
    targetScreen: string
  ) => ({ navigation }: { navigation: BottomTabNavigationProp<ParamListBase> }) => ({
    tabPress: (e: { preventDefault: () => void }) => {
      const state = navigation.getState();
      if (state) {
        const nonTargetRoute = state.routes.find(
          (route) => route.name === routeName && route.state && (route.state?.index ?? 0) > 0
        );
        if (nonTargetRoute) {
          e.preventDefault();
          navigation.navigate(targetScreen, { screen: targetScreen });
        }
      }
    },
  });

  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.icon,
        tabBarStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={StackNavigation}
        options={{
          tabBarIcon: ({ color }) => (
            <HomeIcon style={styles.IconStyle} color={color} />
          ),
        }}
        listeners={handleTabPress('HomeScreen', 'Home')}
      />
      <Tab.Screen
        name="Map"
        component={MachineLocation}
        options={{
          tabBarIcon: ({ color }) => (
            <MapIcon style={styles.IconStyle} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Offer"
        component={OfferScreenNavigation}
        options={{
          tabBarIcon: ({ color }) => (
            <OfferIcon style={styles.IconStyle} color={color} />
          ),
        }}
        listeners={handleTabPress('Offer', 'Offers')}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigator;

const styles = StyleSheet.create({
  IconStyle: {
    width: 24,
    height: 24,
  },
});
