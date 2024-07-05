import React from 'react';
import { View, StyleSheet, Image, SafeAreaView, Dimensions } from 'react-native';
import { Image as ImageType } from '../mockData/OffersCarousel';
import { RADIUS, SPACING } from '../theme';
import Carousel from './Carousel';

type Props = {
    images: ImageType[];
};

const OffersCarousel = ({ images }: Props) => {
    const screenWidth = Dimensions.get('window').width;
    const itemWidth = screenWidth - 1.2 * SPACING.spacing03;

    return (
        <SafeAreaView style={styles.container}>
            <Carousel
                data={images}
                renderItem={(item: ImageType) => (
                    <View style={[styles.imageContainer, { width: itemWidth, paddingLeft: 2 }]}>
                        <Image source={{ uri: item.uri }} style={styles.image} />
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageContainer: {
        height: 120,
        marginRight: SPACING.spacing02,
    },
    image: {
        flex: 1,
        resizeMode: 'cover',
        borderRadius: RADIUS.small,
    },

});

export default OffersCarousel;
