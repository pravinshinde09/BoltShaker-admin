import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, FlatList, Text, Image, ScrollView } from 'react-native';
import { createProduct, listProducts } from '../appwriteDB/appWriteService';
import { account, storage } from '../appwrite/appWriteConfig';
import * as ImagePicker from 'expo-image-picker';
import { Models } from 'appwrite';
import { useLanguage } from '../context/LocalizationContext';

const bucketId = "6673cba400009f844021";

const CreateProductScreen = () => {
  const [title, setTitle] = useState({ en: '', fr: '', pl: '', de: '' });
  const [details, setDetails] = useState({ en: '', fr: '', pl: '', de: '' });
  const [price, setPrice] = useState('');
  const [userId, setUserId] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [products, setProducts] = useState<Models.Document[]>([]);
  const { locale } = useLanguage();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const handleImagePick = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        const firstImage = result.assets[0];
        if (firstImage && firstImage.uri) {
          setImageUri(firstImage.uri);
        }
      }
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };

  const handleImageUpload = async (imageUri: string) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const fileName = imageUri.split('/').pop() || `image-${Date.now()}.jpg`;

      const file = new File([blob], fileName, { type: blob.type });

      const uploadResponse = await storage.createFile(bucketId, 'unique()', file);
      const fileUrl = storage.getFileView(bucketId, uploadResponse.$id);

      return fileUrl.href;
    } catch (error) {
      console.log('Error uploading image:', error);
      return '';
    }
  };

  const handleSubmit = async () => {
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      Alert.alert('Error', 'Price must be a valid number');
      return;
    }

    let imageUrl = '';
    if (imageUri) {
      imageUrl = await handleImageUpload(imageUri);
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
      price: parsedPrice,
      userId,
      imageUrl,
    };
  
    try {
      const response = await createProduct(product);
      if (response) {
        Alert.alert('Product created successfully');
        setTitle({ en: '', fr: '', pl: '', de: '' });
        setDetails({ en: '', fr: '', pl: '', de: '' });
        setPrice('');
        setImageUri(null);
        fetchProducts(userId);
      } else {
        Alert.alert('Error creating product');
      }
    } catch (error) {
      Alert.alert('Error', `Error creating product: ${(error as Error).message}`);
    }
  };

  const fetchProducts = async (userId: string) => {
    try {
      const response = await listProducts(userId);
      if (response) {
        setProducts(response);
      }
    } catch (error) {
      console.log('Error fetching products:', error);
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await account.get();
        if (user) {
          setUserId(user.$id);
          fetchProducts(user.$id);
        }
      } catch (error) {
        console.log('Error fetching user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <TextInput placeholder="Name (English)" value={title.en} onChangeText={(text) => setTitle(prev => ({ ...prev, en: text }))} style={styles.input} />
      <TextInput placeholder="Name (French)" value={title.fr} onChangeText={(text) => setTitle(prev => ({ ...prev, fr: text }))} style={styles.input} />
      <TextInput placeholder="Name (Polish)" value={title.pl} onChangeText={(text) => setTitle(prev => ({ ...prev, pl: text }))} style={styles.input} />
      <TextInput placeholder="Name (German)" value={title.de} onChangeText={(text) => setTitle(prev => ({ ...prev, de: text }))} style={styles.input} />

      <TextInput placeholder="Description (English)" value={details.en} onChangeText={(text) => setDetails(prev => ({ ...prev, en: text }))} style={styles.input} />
      <TextInput placeholder="Description (French)" value={details.fr} onChangeText={(text) => setDetails(prev => ({ ...prev, fr: text }))} style={styles.input} />
      <TextInput placeholder="Description (Polish)" value={details.pl} onChangeText={(text) => setDetails(prev => ({ ...prev, pl: text }))} style={styles.input} />
      <TextInput placeholder="Description (German)" value={details.de} onChangeText={(text) => setDetails(prev => ({ ...prev, de: text }))} style={styles.input} />

      <TextInput placeholder="Price" value={price} onChangeText={setPrice} style={styles.input} keyboardType="numeric" />
      <Button title="Pick Image" onPress={handleImagePick} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Button title="Create Product" onPress={handleSubmit} />
      <FlatList
        data={products}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Text style={styles.productTitle}>{item[`title_${locale}`]} </Text>
            <Text>{item[`details_${locale}`]}</Text>
            <Text>${item.price}</Text>
            {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.image} />}
          </View>
        )}
      />
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
  image: {
    width: 100,
    height: 100,
    marginVertical: 12,
  },
  productItem: {
    padding: 16,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateProductScreen;
