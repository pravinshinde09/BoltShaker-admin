import { StyleSheet, View } from 'react-native';
import React from 'react';

type Align = 'row' | 'column';

type Props = {
  align: Align;
  children: React.ReactNode[];
};

const ButtonGroup = ({ align, children }: Props) => {
  return (
    <View style={[styles.container, align === 'row' ? styles.row : styles.column]}>
      {children.map((child, index) => (
        <View key={index} style={styles.buttonStyle}>
          {child}
        </View>
      ))}
    </View>
  );
};

export default ButtonGroup;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  buttonStyle: {
    margin: 5
  }
});
