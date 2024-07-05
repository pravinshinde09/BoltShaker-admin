import React, { useState } from 'react';
import { Button, Image, SafeAreaView, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Client, ID, Storage } from 'appwrite';

// Replace with your Appwrite endpoint, project ID, and bucket ID
const client = new Client();
client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('65fd7acd51f3eee422c3');

const storage = new Storage(client);
const bucketId = '6673cba400009f844021';

const ImagePickerScreen = () => {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // Request storage permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      console.error('Sorry, we need camera roll permissions to pick an image');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  console.log('i9mage:', image)

  const uploadFile = async () => {
    if (!image) {
      console.error('Please select an image first');
      return;
    }

    const response = await fetch(image);
    const blob = await response.blob();

    const filename = image.split('/').pop(); 
    console.log('fileName:', filename)
    const mimeType = 'image/jpeg'; // Assuming JPEG image (adjust based on actual type)

    const file = new File([blob], filename, { type: mimeType });

    try {
      const uploadResult = await storage.createFile(bucketId, ID.unique(), file);
      console.log('Upload successful:', uploadResult);
      // Handle successful upload (e.g., clear image selection)
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      <Button title="Pick Image" onPress={pickImage} />
      <Button title="Upload Image" onPress={uploadFile} disabled={!image} />
    </SafeAreaView>
  );
};

export default ImagePickerScreen;



// import React, { useState } from 'react';
// import { Button, Image, SafeAreaView, View } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { Client, ID, Storage } from 'appwrite';

// // Replace with your Appwrite endpoint, project ID, and bucket ID
// const client = new Client();
// client
//    .setEndpoint('https://cloud.appwrite.io/v1')
//    .setProject('65fd7acd51f3eee422c3');

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
//       setImage(result.uri);
//     }
//   };

//   const uploadFile = async () => {
//     if (!image) {
//       console.error('Please select an image first');
//       return;
//     }

//     const response = await fetch(image);
//     const blob = await response.blob();

//     const filename = image.split('/').pop(); // Extract filename from URI
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
