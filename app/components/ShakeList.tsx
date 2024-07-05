import { View } from 'react-native'
import React from 'react'
import { useShakesContext } from '../context/ShakeContext'
import ShakeCard from './ShakeCard';
import Typography from './Typography';

const ShakeList = () => {
  const { isLoading, filterShakes } = useShakesContext();
  return (
    <View>
      {isLoading ? (
        <Typography variant="title03">Loading...</Typography>
      ) : (
        filterShakes.map((shake, index) => (
          <ShakeCard key={index} shakes={[shake]} />
        ))
      )}
    </View>
  )
}

export default ShakeList;