import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, ScrollView, Image, Switch, Text } from 'react-native';
import { updateProduct, getProduct, updateNutritionalDetails, getNutritionalDetailsById } from '../appwriteDB/appWriteService';
import { useRoute, RouteProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { deleteImage, uploadImage } from './CloudinaryService';

type NutritionalDetails = {
  size: string;
  calories: string;
  fat: string;
  carbs: string;
  salt: string;
  proteins: string;
};

type EditProductScreenRouteProp = RouteProp<{ params: { productId: string } }, 'params'>;

const EditProductScreen = () => {
  const route = useRoute<EditProductScreenRouteProp>();
  const productId = route.params.productId;
  const [title, setTitle] = useState({ en: '', fr: '', pl: '', de: '' });
  const [details, setDetails] = useState({ en: '', fr: '', pl: '', de: '' });
  const [price, setPrice] = useState({ USD: '', INR: '', EUR: '' });
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [deleteToken, setDeleteToken] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [nutritionalDetails, setNutritionalDetails] = useState<NutritionalDetails>({
    size: '',
    calories: '',
    fat: '',
    carbs: '',
    proteins: '',
    salt: '',
  });
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [nutritionalDetailsId, setNutritionalDetailsId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const product = await getProduct(productId);
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
        setIsOutOfStock(product.isOutOfStock);
        setDeleteToken(product.deleteToken);
        setNutritionalDetailsId(product.nutritionalDetailsId);
        const nutritionalDetailsResponse = await getNutritionalDetailsById(product.nutritionalDetailsId);
        setNutritionalDetails({
          size: nutritionalDetailsResponse.size,
          calories: nutritionalDetailsResponse.calories,
          fat: nutritionalDetailsResponse.fat,
          carbs: nutritionalDetailsResponse.carbs,
          proteins: nutritionalDetailsResponse.proteins,
          salt: nutritionalDetailsResponse.salt,
        });
      } catch (error) {
        console.log('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [productId]);

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
    console.log('deleteToken:',deleteToken)
  
    try {
      // Delete existing image if deleteToken exists
      if (deleteToken) {
        await deleteImage(deleteToken);
      }
  
      // Upload new image
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
      if (nutritionalDetailsId) {
        await updateNutritionalDetails(nutritionalDetailsId, nutritionalDetails);
      } else {
        Alert.alert('Error', 'Nutritional details ID is missing');
        return;
      }

      const product = {
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
        isOutOfStock,
        deleteToken,
        nutritionalDetailsId,
      };

      const response = await updateProduct(productId, product);
      if (response) {
        Alert.alert('Product updated successfully');
      } else {
        Alert.alert('Error updating product');
      }
    } catch (error) {
      Alert.alert('Error', `Error updating product: ${(error as Error).message}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        placeholder="Name (English)"
        value={title.en}
        onChangeText={(text) => setTitle(prev => ({ ...prev, en: text }))}
        style={styles.input}
      />
      <TextInput
        placeholder="Name (French)"
        value={title.fr}
        onChangeText={(text) => setTitle(prev => ({ ...prev, fr: text }))}
        style={styles.input}
      />
      <TextInput
        placeholder="Name (Polish)"
        value={title.pl}
        onChangeText={(text) => setTitle(prev => ({ ...prev, pl: text }))}
        style={styles.input}
      />
      <TextInput
        placeholder="Name (German)"
        value={title.de}
        onChangeText={(text) => setTitle(prev => ({ ...prev, de: text }))}
        style={styles.input}
      />

      <TextInput
        placeholder="Description (English)"
        value={details.en}
        onChangeText={(text) => setDetails(prev => ({ ...prev, en: text }))}
        style={styles.input}
      />
      <TextInput
        placeholder="Description (French)"
        value={details.fr}
        onChangeText={(text) => setDetails(prev => ({ ...prev, fr: text }))}
        style={styles.input}
      />
      <TextInput
        placeholder="Description (Polish)"
        value={details.pl}
        onChangeText={(text) => setDetails(prev => ({ ...prev, pl: text }))}
        style={styles.input}
      />
      <TextInput
        placeholder="Description (German)"
        value={details.de}
        onChangeText={(text) => setDetails(prev => ({ ...prev, de: text }))}
        style={styles.input}
      />

      <TextInput
        placeholder="Price (USD)"
        value={price.USD}
        onChangeText={(text) => setPrice(prev => ({ ...prev, USD: text }))}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Price (INR)"
        value={price.INR}
        onChangeText={(text) => setPrice(prev => ({ ...prev, INR: text }))}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Price (EUR)"
        value={price.EUR}
        onChangeText={(text) => setPrice(prev => ({ ...prev, EUR: text }))}
        style={styles.input}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Size"
        value={nutritionalDetails.size}
        onChangeText={(text) => setNutritionalDetails(prev => ({ ...prev, size: text }))}
        style={styles.input}
      />
      <TextInput
        placeholder="Calories"
        value={nutritionalDetails.calories}
        onChangeText={(text) => setNutritionalDetails(prev => ({ ...prev, calories: text }))}
        style={styles.input}
      />
      <TextInput
        placeholder="Fat"
        value={nutritionalDetails.fat}
        onChangeText={(text) => setNutritionalDetails(prev => ({ ...prev, fat: text }))}
        style={styles.input}
      />
      <TextInput
        placeholder="Carbs"
        value={nutritionalDetails.carbs}
        onChangeText={(text) => setNutritionalDetails(prev => ({ ...prev, carbs: text }))}
        style={styles.input}
      />
      <TextInput
        placeholder="Proteins"
        value={nutritionalDetails.proteins}
        onChangeText={(text) => setNutritionalDetails(prev => ({ ...prev, proteins: text }))}
        style={styles.input}
      />
      <TextInput
        placeholder="Salt"
        value={nutritionalDetails.salt}
        onChangeText={(text) => setNutritionalDetails(prev => ({ ...prev, salt: text }))}
        style={styles.input}
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
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
