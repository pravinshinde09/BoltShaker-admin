import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, FlatList, Text, Image } from 'react-native';
import { createProduct, listProducts } from '../appwriteDB/appWriteService';
import { account, storage } from '../appwrite/appWriteConfig';
import * as ImagePicker from 'expo-image-picker';
import { Models } from 'appwrite';

const bucketId = "6673cba400009f844021";

const CreateShake = () => {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [price, setPrice] = useState('');
  const [userId, setUserId] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [products, setProducts] = useState<Models.Document[]>([]); 

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
      console.log("uploadResp:",uploadResponse)
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
    console.log('//imageUrl:',imageUrl)

    const product = { title, details, price: parsedPrice, userId, imageUrl };
    try {
      const response = await createProduct(product);
      if (response) {
        Alert.alert('Product created successfully');
        setTitle('');
        setDetails('');
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
    <View style={styles.container}>
      <TextInput placeholder="Name" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput placeholder="Description" value={details} onChangeText={setDetails} style={styles.input} />
      <TextInput placeholder="Price" value={price} onChangeText={setPrice} style={styles.input} keyboardType="numeric" />
      <Button title="Pick Image" onPress={handleImagePick} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Button title="Create Product" onPress={handleSubmit} />
      <FlatList
        data={products}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Text style={styles.productTitle}>{item.title}</Text>
            <Text>{item.details}</Text>
            <Text>${item.price}</Text>
            {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.image} />}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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

export default CreateShake;


















// import React, { useState } from 'react';
// import { View, Text, Button, Image, StyleSheet } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { Client, Storage } from 'appwrite';

// const App = () => {
//   const [selectedImage, setSelectedImage] = useState('');

//   const client = new Client();
//   client
//     .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!) 
//     .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!); 

//   const storage = new Storage(client);

//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.All,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     console.log(result);

//     if (!result.canceled) {
//       setSelectedImage(result.assets[0].uri);
//     }
//   };

//   const uploadImage = async () => {
//     if (selectedImage) {
//       try {
//         const fileUri = selectedImage;
//         const fileName = fileUri.split('/').pop();

//         const formData = new FormData();
//         formData.append('file', {
//           uri: fileUri,
//           name: fileName,
//           type: 'image/jpeg', 
//         });

//         const response = await storage.createFile(
//           '6673cba400009f844021', 
//           'unique()', 
//           formData
//         );

//         console.log('File uploaded successfully:', response);
//       } catch (error) {
//         console.error('File upload failed:', error);
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Upload Image to AppWrite Storage</Text>
//       <Button title="Pick an image from camera roll" onPress={pickImage} />
//       {selectedImage && (
//         <View style={styles.imageContainer}>
//           <Image source={{ uri: selectedImage }} style={styles.image} />
//         </View>
//       )}
//       <Button title="Upload Image" onPress={uploadImage} disabled={!selectedImage} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   imageContainer: {
//     marginTop: 20,
//     marginBottom: 20,
//     alignItems: 'center',
//   },
//   image: {
//     width: 300,
//     height: 300,
//     resizeMode: 'contain',
//   },
// });

// export default App;
