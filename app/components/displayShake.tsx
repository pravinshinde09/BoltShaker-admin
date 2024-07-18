import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Image, ScrollView, Button, Alert } from 'react-native';
import { useShakes } from '../context/ShakeContext1';
import { useLanguage } from '../context/LocalizationContext';
import { useCurrency } from '../context/CurrencyProvider';
import Typography from './Typography';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { HomeStackParamList } from '../navigation/HomeScreenNavigation';
import Loading from './Loading';

const DisplayShakes = () => {
  const { products, nutritionalDetailsMap , loading} = useShakes();
  const { locale } = useLanguage();
  const { currency, formatPrice } = useCurrency();
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();

  const handleEdit = (productId: string) => {
    navigation.navigate('EditProductScreen', { productId });
  };
  
  const handleDelete = (productId: string) => {
    // Handle the delete action, e.g., delete the product
    Alert.alert('Delete', `Delete product with ID: ${productId}`);
  };
if (loading) {
    return(
        <Loading/>
    )
}
  return (
    <ScrollView style={styles.container}>
      {products.map((item) => (
        <View key={item.$id} style={styles.productCard}>
          <View style={styles.productCardContent}>
            <Text style={styles.productTitle}>{item[`title_${locale}`]}</Text>
            <Text>{item[`details_${locale}`]}</Text>
            <Typography variant='title04'>
              {formatPrice(item[`price_${currency}`])}
            </Typography>
            {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.image} />}
            
            {nutritionalDetailsMap[item.$id] && (
              <View style={styles.nutritionalDetailsContainer}>
                <Text>Size: {nutritionalDetailsMap[item.$id].size}</Text>
                <Text>Calories: {nutritionalDetailsMap[item.$id].calories}</Text>
                <Text>Fat: {nutritionalDetailsMap[item.$id].fat}</Text>
                <Text>Carbs: {nutritionalDetailsMap[item.$id].carbs}</Text>
                <Text>Proteins: {nutritionalDetailsMap[item.$id].proteins}</Text>
                <Text>Salt: {nutritionalDetailsMap[item.$id].salt}</Text>
              </View>
            )}
            <View style={styles.buttonContainer}>
              <Button title="Edit" onPress={() => handleEdit(item.$id)} />
              <Button title="Delete" onPress={() => handleDelete(item.$id)} color="red" />
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productCardContent: {
    padding: 16,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 8,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  nutritionalDetailsContainer: {
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});

export default DisplayShakes;
