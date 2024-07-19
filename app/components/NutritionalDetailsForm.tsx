import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface NutritionalDetails {
  size: string;
  calories: string;
  fat: string;
  carbs: string;
  proteins: string;
  salt: string;
}

interface Props {
  nutritionalDetails: NutritionalDetails;
  setNutritionalDetails: React.Dispatch<React.SetStateAction<NutritionalDetails>>;
}

const NutritionalDetailsForm: React.FC<Props> = ({ nutritionalDetails, setNutritionalDetails }) => {
  const handleChange = (key: keyof NutritionalDetails, text: string) => {
    setNutritionalDetails((prev) => ({
      ...prev,
      [key]: text,
    }));
  };

  return (
    <View>
      {Object.keys(nutritionalDetails).map((key) => (
        <TextInput
          key={key}
          placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
          value={nutritionalDetails[key as keyof NutritionalDetails]}
          onChangeText={(text) => handleChange(key as keyof NutritionalDetails, text)}
          style={styles.input}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default NutritionalDetailsForm;
