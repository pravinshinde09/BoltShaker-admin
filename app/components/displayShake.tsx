import React from 'react';
import { View, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { useShakes } from '../context/ShakeContext1';
import { useLanguage } from '../context/LocalizationContext';
import { useCurrencyContext } from '../context/CurrencyProvider';
import Typography from './Typography';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { HomeStackParamList } from '../navigation/HomeScreenNavigation';
import Loading from './Loading';
import { StyleProps, useTheme } from '../context/ThemeProvider';
import { SPACING, RADIUS } from '../theme';

// Define your Product and NutritionalDetails interfaces if not imported from elsewhere
export interface Product {
  $id: string;
  title_en: string;
  title_fr: string;
  title_de: string;
  title_pl: string;
  details_en: string;
  details_fr: string;
  details_de: string;
  details_pl: string;
  price_USD: number;
  price_INR: number;
  price_EUR: number;
  imageUrl?: string;
}

export interface NutritionalDetails {
  size: string;
  calories: string;
  fat: string;
  carbs: string;
  proteins: string;
  salt: string;
}

interface DisplayShakesProps {}

const DisplayShakes: React.FC<DisplayShakesProps> = () => {
  const { currency, formatPrice } = useCurrencyContext();
  const { locale } = useLanguage();
  const { colors } = useTheme();
  const styles = getStyles({ colors });
  const { products, nutritionalDetailsMap, loading } = useShakes();
  
 
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();

  const handleEdit = (productId: string) => {
    navigation.navigate('EditProductScreen', { productId });
  };

  const shakeDetails = (productId: string) => {
    const product = products.find(item => item.$id === productId) as unknown as Product; 
    if (!product) return;
  
    navigation.navigate('ShakeFullDetails', {
      productId,
      product,
      nutritionalDetails: nutritionalDetailsMap[productId],
    });
  };

  const handleDelete = (productId: string) => {
    Alert.alert('Delete', `Delete product with ID: ${productId}`);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View>
      {products.map((item) => (
        <TouchableOpacity
          key={item.$id} 
          style={styles.container}
          onPress={() => shakeDetails(item.$id)}
        >
          {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.imageStyle} />}
          <View style={styles.content}>
            <Typography variant="title03">{item[`title_${locale}`]}</Typography>
            <Typography numberOfLines={2} variant="body02">
              {item[`details_${locale}`]}
            </Typography>
            <Typography variant="title03"> {formatPrice(item[`price_${currency}`])}</Typography>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const getStyles = ({ colors }: StyleProps) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      marginVertical: SPACING.spacing02,
      gap: SPACING.spacing02,
      borderRadius: RADIUS.small,
      backgroundColor: colors.card,
    },
    imageStyle: {
      width: 100,
      height: 100,
      borderRadius: RADIUS.small,
      marginRight: SPACING.spacing02,
      resizeMode: "cover",
    },
    content: {
      flex: 1,
      padding: SPACING.spacing01,
    },
  });

export default DisplayShakes;
