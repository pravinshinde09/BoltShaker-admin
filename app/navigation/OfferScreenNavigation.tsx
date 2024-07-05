import React from "react";
import { Platform, StyleSheet, TouchableOpacity } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import OffersScreen from '../screens/Offers/OffersScreen';
import OffersDetails from '../components/OffersDetails';
import { AntDesign } from '@expo/vector-icons';
import { type StyleProps, useTheme } from '../context/ThemeProvider';
import { RADIUS, SPACING } from '../theme';
import { OffersType } from "../types/offerDetailsType";

export type OfferStackParamList = {
  Offers: undefined,
  OffersDetails: { selectedItem: OffersType };
};

const Stack = createStackNavigator<OfferStackParamList>();

const OfferScreenNavigation = ({ navigation }: any) => {
  const { colors } = useTheme();
  const styles = getStyles({ colors })

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

      }}
    >
      <Stack.Screen
        name="Offers"
        component={OffersScreen}
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          headerTitleStyle: {
            color: colors.text
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.arrowIconStyle}>
              <AntDesign name="arrowleft" size={24} style={styles.IconStyle} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name='OffersDetails' component={OffersDetails}
        options={{
          headerBackTitleVisible: false
        }}
      />
    </Stack.Navigator>
  )
}

export default OfferScreenNavigation

const getStyles = ({ colors }: StyleProps) => StyleSheet.create({
  IconStyle: {
    color: colors.icon
  },
  arrowIconStyle: {
    marginLeft: SPACING.spacing03
  }
})
