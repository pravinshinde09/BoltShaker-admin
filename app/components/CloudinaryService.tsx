const FILE_EXTENSION_REGEX = /\.(\w+)$/;

const CLOUDINARY_URL = process.env.EXPO_PUBLIC_CLOUDINARY_URL!;
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_UPLOAD_PRESET_ID!;
const DELETE_TOKEN = process.env.EXPO_PUBLIC_CLOUD_DELETE_TOKEN_URL!;

export const uploadImage = async (pickerResult: any) => {
  if (pickerResult.canceled || !pickerResult.assets || pickerResult.assets.length === 0) {
    throw new Error('No image selected');
  }

  const localUri = pickerResult.assets[0].uri;
  const filename = localUri.split('/').pop() || 'test.jpg';
  const match = FILE_EXTENSION_REGEX.exec(filename);
  const type = match ? `image/${match[1]}` : 'image';

  const file = {
    uri: localUri,
    type: type,
    name: filename,
  } as any;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const response = await fetch(CLOUDINARY_URL, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  const data = await response.json();
  return data;
};

export const deleteImage = async (deleteToken: string) => {
  const response = await fetch(DELETE_TOKEN, {
    method: 'POST',
    body: JSON.stringify({ token: deleteToken }),
    headers: {
        'Content-Type': 'application/json',
    },
});
  console.log('respo:', response)

  if (!response.ok) {
    throw new Error('Delete failed');
  }

  return await response.json();
};
