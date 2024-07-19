import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/Home/HomeScreen';
import ShakeDetails from '../components/ShakeDetails';
import { ShakesType } from '../types/shakeDetailsTypes';
import SelectLanguage from '../components/SelectLanguage';
import ChangeCurrency from "../components/ChangeCurrency";
import Theme from '../components/Theme';
import ScreenLock from '../components/ScreenLock';
import Cart from '../components/Cart';
import UnpaidQR from '../components/UnpaidQR';
import { useTheme } from '../context/ThemeProvider';
import SettingsScreen from "../screens/Settings/SettingsScreen";
import { Platform } from "react-native";
import { RADIUS } from "../theme";
import MyQRCode from "../components/MyQRCode";
import CreateShake from "../components/CreateShake";
import EditProductScreen from "../components/EditShake";
import ShakeFullDetails from "../components/ShakeFullDetails";
import { NutritionalDetails, Product } from "../components/DisplayShake";

export type HomeStackParamList = {
  Home: undefined;
  Setting: undefined;
  ShakeDetails: { selectedItem: ShakesType };
  SelectLanguage: undefined;
  ChangeCurrency: undefined;
  Theme: undefined;
  ScreenLock: undefined;
  Cart: {
    selectedItem: ShakesType;
    quantity: number;
    totalPrice: number;
    selectedAddOns: Record<string, any>;
  };
  MyQRCode: {
    selectedItem: ShakesType;
    quantity: number;
    totalPrice: number;
    selectedAddOns: Record<string, any>
  };

  UnpaidQR: {
    selectedItem: ShakesType;
    quantity: number;
    totalPrice: number;
    selectedAddOns: Record<string, any>
  };
  CreateShake: undefined;
  EditProductScreen: {
    productId:string
  };
  ShakeFullDetails: {
    productId:string,
    product:Product,
    nutritionalDetails:NutritionalDetails
  }

};

const Stack = createStackNavigator<HomeStackParamList>();

const HomeScreenNavigation = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: [{
          backgroundColor: colors.background,
        },
        Platform.OS === 'ios' && {
          shadowRadius: RADIUS.small,
        },
        ],
        headerTintColor: colors.text,
        headerTitleAlign: 'center',
        cardStyle: { backgroundColor: colors.background },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Setting"
        component={SettingsScreen}
      />
      <Stack.Screen
        name="ShakeDetails"
        component={ShakeDetails}
        options={{
          headerTitle: '',
          headerShown: true,
          headerTransparent: true
        }}
      />
      <Stack.Screen
        name="SelectLanguage"
        component={SelectLanguage}
        options={{
          headerTitle: 'Language',
        }}
      />
      <Stack.Screen
        name="ChangeCurrency"
        component={ChangeCurrency}
        options={{
          headerTitle: 'Currency',
        }}
      />
      <Stack.Screen
        name="Theme"
        component={Theme}
      />
      <Stack.Screen
        name="ScreenLock"
        component={ScreenLock}
      />
      <Stack.Screen
        name="Cart"
        component={Cart}
      />
      <Stack.Screen
        name="MyQRCode"
        component={MyQRCode}
      />
      <Stack.Screen
        name="UnpaidQR"
        component={UnpaidQR}
      />
      <Stack.Screen
        name="CreateShake"
        component={CreateShake}
      />
       <Stack.Screen
        name="EditProductScreen"
        component={EditProductScreen}
      />
      <Stack.Screen
        name="ShakeFullDetails"
        component={ShakeFullDetails}
        options={{
          headerTitle: '',
          headerShown: true,
          headerTransparent: true
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeScreenNavigation;
