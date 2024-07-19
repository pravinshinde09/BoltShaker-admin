import React, { useState, useEffect } from 'react';
import { View, Button, Alert, StyleSheet, ScrollView, Image, Switch, Text } from 'react-native';
import { updateProduct, getProduct, getNutritionalDetailsById, createNutritionalDetails } from '../appwriteDB/appWriteService';
import { RouteProp, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage, deleteImage } from './CloudinaryService';
import Input from './Inputs';
import NutritionalDetailsForm from './NutritionalDetailsForm';

type EditProductScreenRouteProp = RouteProp<{ params: { productId: string } }, 'params'>;
type Language = 'en' | 'fr' | 'pl' | 'de';
type Currency = 'USD' | 'INR' | 'EUR';

const EditProductScreen = () => {
  const route = useRoute<EditProductScreenRouteProp>();
  const productId = route.params.productId;
  const [title, setTitle] = useState<Record<Language, string>>({ en: '', fr: '', pl: '', de: '' });
  const [details, setDetails] = useState<Record<Language, string>>({ en: '', fr: '', pl: '', de: '' });
  const [price, setPrice] = useState<Record<Currency, string>>({ USD: '', INR: '', EUR: '' });
  const [userId, setUserId] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [deleteToken, setDeleteToken] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [nutritionalDetails, setNutritionalDetails] = useState({
    size: '',
    calories: '',
    fat: '',
    carbs: '',
    proteins: '',
    salt: '',
  });
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  useEffect(() => {
    fetchProductData();
  }, []);

  const fetchProductData = async () => {
    try {
      const product = await getProduct(productId);
      if (!product) {
        Alert.alert('Error', 'Product not found');
        return;
      }
  
      let nutritionalDetailsData = {
        size: '',
        calories: '',
        fat: '',
        carbs: '',
        proteins: '',
        salt: '',
      };
  
      if (product.nutritionalDetailsId) {
        const nutritionalDetailsDoc = await getNutritionalDetailsById(product.nutritionalDetailsId);
        nutritionalDetailsData = {
          size: nutritionalDetailsDoc.size || '',
          calories: nutritionalDetailsDoc.calories || '',
          fat: nutritionalDetailsDoc.fat || '',
          carbs: nutritionalDetailsDoc.carbs || '',
          proteins: nutritionalDetailsDoc.proteins || '',
          salt: nutritionalDetailsDoc.salt || '',
        };
      }
  
      setTitle({
        en: product.title_en,
        fr: product.title_fr,
        pl: product.title_pl,
        de: product.title_de,
      });
      setDetails({
        en: product.details_en,
        fr: product.details_fr,
        pl: product.details_pl,
        de: product.details_de,
      });
      setPrice({
        USD: product.price_USD.toString(),
        INR: product.price_INR.toString(),
        EUR: product.price_EUR.toString(),
      });
      setImageUri(product.imageUrl);
      setDeleteToken(product.deleteToken);
      setUserId(product.userId);
      setNutritionalDetails({
        ...nutritionalDetailsData,
      });
      setIsOutOfStock(product.isOutOfStock);
    } catch (error) {
      Alert.alert('Error', `Error fetching product data: ${(error as Error).message}`);
    }
  };
  
  const selectImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission denied', 'You need to grant access to your photo library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        handleImagePick(result);
      } else {
        Alert.alert('Image selection canceled');
      }
    } catch (error) {
      console.error('Image selection error:', error);
      Alert.alert('Image selection failed', 'An error occurred while selecting your image');
    }
  };

  const handleImagePick = async (pickerResult: ImagePicker.ImagePickerResult) => {
    if (isUploading) return;
    setIsUploading(true);

    try {
     
      if (deleteToken) {
        await deleteImage(deleteToken);
      }

      const data = await uploadImage(pickerResult);
      setImageUri(data.secure_url);
      setDeleteToken(data.delete_token);
    } catch (error) {
      console.error('Image upload error:', error);
      Alert.alert('Image upload failed', 'An error occurred while uploading your image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    const parsedPriceUSD = parseFloat(price.USD);
    const parsedPriceINR = parseFloat(price.INR);
    const parsedPriceEUR = parseFloat(price.EUR);

    if (isNaN(parsedPriceUSD) || isNaN(parsedPriceINR) || isNaN(parsedPriceEUR)) {
      Alert.alert('Error', 'All prices must be valid numbers');
      return;
    }

    try {
      const detailsResponse = await createNutritionalDetails(nutritionalDetails);
      const nutritionalDetailsId = detailsResponse.$id;

      const product = {
        userId,
        title_en: title.en,
        title_fr: title.fr,
        title_pl: title.pl,
        title_de: title.de,
        details_en: details.en,
        details_fr: details.fr,
        details_pl: details.pl,
        details_de: details.de,
        price_USD: parsedPriceUSD,
        price_INR: parsedPriceINR,
        price_EUR: parsedPriceEUR,
        imageUrl: imageUri,
        nutritionalDetailsId,
        isOutOfStock,
        deleteToken,
      };

      const response = await updateProduct(productId, product);
      if (response) {
        Alert.alert('Product updated successfully');
        fetchProductData();
      } else {
        Alert.alert('Error updating product');
      }
    } catch (error) {
      Alert.alert('Error', `Error updating product: ${(error as Error).message}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {(['en', 'fr', 'pl', 'de'] as Language[]).map((lang) => (
        <Input
          key={lang}
          placeholder={`Name (${lang.toUpperCase()})`}
          value={title[lang]}
          onChangeText={(text) => setTitle((prev) => ({ ...prev, [lang]: text }))}
        />
      ))}

      {(['en', 'fr', 'pl', 'de'] as Language[]).map((lang) => (
        <Input
          key={lang}
          placeholder={`Description (${lang.toUpperCase()})`}
          value={details[lang]}
          onChangeText={(text) => setDetails((prev) => ({ ...prev, [lang]: text }))}
        />
      ))}

      {(['USD', 'INR', 'EUR'] as Currency[]).map((currency) => (
        <Input
          key={currency}
          placeholder={`Price (${currency})`}
          value={price[currency]}
          onChangeText={(text) => setPrice((prev) => ({ ...prev, [currency]: text }))}
          keyboardType="numeric"
        />
      ))}

      <NutritionalDetailsForm
        nutritionalDetails={nutritionalDetails}
        setNutritionalDetails={setNutritionalDetails}
      />

      <View style={styles.switchContainer}>
        <Text>Out of Stock</Text>
        <Switch
          value={isOutOfStock}
          onValueChange={setIsOutOfStock}
        />
      </View>
      <View style={{ marginBottom: 32 }}>
        <Button title="Pick Image" onPress={selectImage} />
        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
        <Button title="Update Product" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 12,
  },
});

export default EditProductScreen;
