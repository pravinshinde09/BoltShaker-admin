import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

type Props = {
    placeholder: string; 
    value: string; 
    onChangeText: (text: string) => void; 
    keyboardType?: TextInputProps['keyboardType'];
};

const Input = ({ placeholder, value, onChangeText, keyboardType = 'default' }: Props) => (
  <TextInput
    placeholder={placeholder}
    value={value}
    onChangeText={onChangeText}
    style={styles.input}
    keyboardType={keyboardType}
  />
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

export default Input;
