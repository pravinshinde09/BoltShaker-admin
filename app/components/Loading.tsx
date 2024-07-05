import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { COLORS } from '../theme';

const Loading = () => {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color={COLORS.light.primary} />
      <Text>Loading</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loading;
