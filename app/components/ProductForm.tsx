// import React, { useState, useEffect } from 'react';
// import { View, TextInput, Button, StyleSheet } from 'react-native';
// import { Models } from 'appwrite';

// type ProductFormProps = {
//   onSubmit: (product: Models.Document, nutritionalDetails: any) => void;
//   initialProduct?: Models.Document;
// };

// const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, initialProduct }) => {
//   const [product, setProduct] = useState<Models.Document>({
//     title: '',
//     details: '',
//     price_USD: '',
//     price_INR: '',
//     price_EUR: '',
//     imageUrl: '',
//   });

//   const [nutritionalDetails, setNutritionalDetails] = useState({
//     size: '',
//     color: '',
//     salt: '',
//     proteins: '',
//   });

//   useEffect(() => {
//     if (initialProduct) {
//       setProduct({
//         ...initialProduct,
//         title: initialProduct.title || '',
//         details: initialProduct.details || '',
//         price_USD: String(initialProduct.price_USD || ''),
//         price_INR: String(initialProduct.price_INR || ''),
//         price_EUR: String(initialProduct.price_EUR || ''),
//         imageUrl: initialProduct.imageUrl || '',
//       });
//       setNutritionalDetails({
//         size: initialProduct.size || '',
//         color: initialProduct.color || '',
//         salt: initialProduct.salt || '',
//         proteins: initialProduct.proteins || '',
//       });
//     }
//   }, [initialProduct]);

//   const handleSubmit = () => {
//     onSubmit(product, nutritionalDetails);
//     setProduct({
//       title: '',
//       details: '',
//       price_USD: '',
//       price_INR: '',
//       price_EUR: '',
//       imageUrl: '',
//     });
//     setNutritionalDetails({
//       size: '',
//       color: '',
//       salt: '',
//       proteins: '',
//     });
//   };

//   const handleChange = (field: keyof Models.Document | keyof typeof nutritionalDetails, value: string) => {
//     if (['size', 'color', 'salt', 'proteins'].includes(field as string)) {
//       setNutritionalDetails(prevDetails => ({
//         ...prevDetails,
//         [field]: value,
//       }));
//     } else {
//       setProduct(prevProduct => ({
//         ...prevProduct,
//         [field]: value,
//       }));
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         placeholder="Title"
//         value={product.title}
//         onChangeText={(text) => handleChange('title', text)}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Details"
//         value={product.details}
//         onChangeText={(text) => handleChange('details', text)}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Price (USD)"
//         value={product.price_USD}
//         onChangeText={(text) => handleChange('price_USD', text)}
//         style={styles.input}
//         keyboardType="numeric"
//       />
//       <TextInput
//         placeholder="Price (INR)"
//         value={product.price_INR}
//         onChangeText={(text) => handleChange('price_INR', text)}
//         style={styles.input}
//         keyboardType="numeric"
//       />
//       <TextInput
//         placeholder="Price (EUR)"
//         value={product.price_EUR}
//         onChangeText={(text) => handleChange('price_EUR', text)}
//         style={styles.input}
//         keyboardType="numeric"
//       />
//       <TextInput
//         placeholder="Size"
//         value={nutritionalDetails.size}
//         onChangeText={(text) => handleChange('size', text)}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Color"
//         value={nutritionalDetails.color}
//         onChangeText={(text) => handleChange('color', text)}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Salt"
//         value={nutritionalDetails.salt}
//         onChangeText={(text) => handleChange('salt', text)}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Proteins"
//         value={nutritionalDetails.proteins}
//         onChangeText={(text) => handleChange('proteins', text)}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Image URL"
//         value={product.imageUrl}
//         onChangeText={(text) => handleChange('imageUrl', text)}
//         style={styles.input}
//       />
//       <Button title="Submit" onPress={handleSubmit} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 12,
//     paddingHorizontal: 8,
//   },
// });

// export default ProductForm;
