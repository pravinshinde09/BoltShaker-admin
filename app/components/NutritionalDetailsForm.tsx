import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

type NutritionalDetails = {
  [key: string]: string;
};

type Props = {
  nutritionalDetails: NutritionalDetails;
  setNutritionalDetails: React.Dispatch<React.SetStateAction<NutritionalDetails>>;
};

const NutritionalDetailsForm: React.FC<Props> = ({ nutritionalDetails, setNutritionalDetails }) => (
  <View>
    {Object.keys(nutritionalDetails).map((key) => (
      <TextInput
        key={key}
        placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
        value={nutritionalDetails[key]}
        onChangeText={(text) => setNutritionalDetails((prev) => ({ ...prev, [key]: text }))}
        style={styles.input}
      />
    ))}
  </View>
);

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
