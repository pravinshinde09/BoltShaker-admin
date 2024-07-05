import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View } from 'react-native';
import OffersCard from '../../components/OffersCard';
import { StyleProps, useTheme } from '../../context/ThemeProvider';
import { databases, APPWRITE_DATABASE_ID, OFFERS_COLLECTION_ID } from "../../appwrite/appWriteConfig";
import { Models } from 'appwrite';
import { useLanguage } from "../../context/LocalizationContext";
import Typography from "../../components/Typography";

const OffersScreen = () => {
  const { colors } = useTheme();
  const style = getStyle({ colors });
  const [data, setData] = useState<Models.Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { locale } = useLanguage();
  const [itemData, setItemData] = useState<{ offers: any[] } | null>(null);

  useEffect(() => {
    // Fetch the list of offer JSON file URLs from the AppWrite database.
    const fetchData = async () => {
      try {
        const response = await databases.listDocuments<Models.Document>(APPWRITE_DATABASE_ID, OFFERS_COLLECTION_ID);
        setData(response.documents);
      } catch (error) {
        console.error("Database error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Fetch the actual offer data from the URL provided in the database for the current locale.
    const fetchItemData = async () => {
      if (data.length > 0 && locale) {
        try {
          setIsLoading(true);
          const fetchedData = await fetch(data[0][locale]).then(response => response.json());
          console.log("fetchedData", fetchedData);
          setItemData(fetchedData);
        } catch (error) {
          console.error("Fetch item data error:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchItemData();
  }, [data, locale]);

  return (
    <ScrollView>
      <View style={style.container}>
        {isLoading ? (
          <Typography variant="title03">Loading data...</Typography>
        ) : (
          itemData && itemData.offers ? (
            <OffersCard OffersData={itemData.offers} />
          ) : (
            <Typography variant="title03">No offers available.</Typography>
          )
        )}
      </View>
    </ScrollView>
  );
};

export default OffersScreen;

const getStyle = ({ colors }: StyleProps) => StyleSheet.create({
  container: {
    backgroundColor: colors.background
  }
});






// import React, { useState } from 'react';
// import { Button, Image, SafeAreaView, View } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { Client, ID, Storage } from 'appwrite';

// // Replace with your Appwrite endpoint, project ID, and bucket ID
// const client = new Client();
// client
//   .setEndpoint('https://cloud.appwrite.io/v1')
//   .setProject('65fd7acd51f3eee422c3');

// const storage = new Storage(client);
// const bucketId = '6673cba400009f844021';

// const ImagePickerScreen = () => {
//   const [image, setImage] = useState(null);

//   const pickImage = async () => {
//     // Request storage permissions
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       console.error('Sorry, we need camera roll permissions to pick an image');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.All,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setImage(result.assets[0].uri);
//     }
//   };

//   console.log('i9mage:', image)

//   const uploadFile = async () => {
//     if (!image) {
//       console.error('Please select an image first');
//       return;
//     }

//     const response = await fetch(image);
//     const blob = await response.blob();

//     const filename = image.split('/').pop(); 
//     console.log('fileName:', filename)
//     const mimeType = 'image/jpeg'; // Assuming JPEG image (adjust based on actual type)

//     const file = new File([blob], filename, { type: mimeType });

//     try {
//       const uploadResult = await storage.createFile(bucketId, ID.unique(), file);
//       console.log('Upload successful:', uploadResult);
//       // Handle successful upload (e.g., clear image selection)
//     } catch (error) {
//       console.error('Upload failed:', error);
//     }
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
//       <Button title="Pick Image" onPress={pickImage} />
//       <Button title="Upload Image" onPress={uploadFile} disabled={!image} />
//     </SafeAreaView>
//   );
// };

// export default ImagePickerScreen;


