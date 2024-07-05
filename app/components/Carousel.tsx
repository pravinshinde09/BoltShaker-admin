import React, { useRef, useEffect, useState } from 'react';
import { FlatList, SafeAreaView, View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeProvider';
import { SPACING, RADIUS } from '../theme';

type CarouselProps<T> = {
    data: T[];
    renderItem: (item: T, index?: number) => React.ReactNode;
};

const Carousel = <T,>({ data, renderItem }: CarouselProps<T>) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList<any>>(null);

    useEffect(() => {
        const autoplayInterval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % data.length;
            setCurrentIndex(nextIndex);
            if (flatListRef.current) {
                flatListRef.current.scrollToIndex({
                    index: nextIndex,
                    animated: true,
                });
            }
        }, 3000);

        return () => clearInterval(autoplayInterval);
    }, [data.length, currentIndex]);

    const { colors } = useTheme();
    return (
        <SafeAreaView>
            <FlatList
                ref={flatListRef}
                data={data}
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                horizontal
                keyExtractor={(_item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View>
                        {renderItem(item)}
                    </View>
                )}
            />
            <View style={styles.pagination}>
                {data.map((_: any, index: number) => (
                    <View
                        key={index}
                        style={[
                            styles.paginationDot,
                            { backgroundColor: index === currentIndex ? colors.primary : colors.primary200 },
                        ]}
                    />
                ))}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    pagination: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: SPACING.spacing02,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: RADIUS.full,
        marginHorizontal: SPACING.spacing01,
    },
});

export default Carousel;
