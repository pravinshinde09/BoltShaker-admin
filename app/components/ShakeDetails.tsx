import React, { useState } from 'react';
import { StyleSheet, Image, View } from 'react-native';
import { RADIUS, SPACING } from '../theme';
import { useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import CheckBox from './CheckBox';
import ADDONDATA from '../mockData/AddOns';
import Button from './Button';
import Wishlist from './Wishlist';
import Typography from './Typography';
import { FontAwesome6 } from '@expo/vector-icons';
import { useLanguage } from '../context/LocalizationContext';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { HomeStackParamList } from '../navigation/HomeScreenNavigation';
import { StyleProps, useTheme } from '../context/ThemeProvider';
import { useCurrencyContext } from '../context/CurrencyProvider';

const ShakeDetails = () => {
    const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
    const route = useRoute();
    const { selectedItem } = route.params as { selectedItem: any };

    const [selectedAddOns, setSelectedAddOns] = useState(
        ADDONDATA.map(addOn => ({ ...addOn, checked: false }))
    );

    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(parseFloat(selectedItem.price))

    const handlePress = (id: string) => {
        setSelectedAddOns(prevState =>
            prevState.map(addOn =>
                addOn.id === id ? { ...addOn, checked: !addOn.checked } : addOn
            )
        );
    };

    const incrementQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
        setTotalPrice((prevPrice: number) => (prevPrice + parseFloat(selectedItem.price)))
    }

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(prevQuantity => prevQuantity - 1);
            setTotalPrice((prevPrice: number) => (prevPrice - parseFloat(selectedItem.price)));
        }
    }

    const { translate } = useLanguage();
    const { formatPrice } = useCurrencyContext();

    const navigateToPaymentMode = () => {
        const selectedAddOnsToSend = selectedAddOns.filter(addOn => addOn.checked);
        navigation.navigate('Cart', {
            selectedItem,
            totalPrice,
            quantity,
            selectedAddOns: selectedAddOnsToSend
        });
    }
    const { colors } = useTheme();
    const styles = getStyle({ colors });


    return (
        <>
            <ScrollView>
                <View style={styles.CardContainer}>
                    <View>
                        <Image
                            source={{ uri: selectedItem.image }}
                            style={styles.ImageStyle}
                        />
                        <View style={styles.wishlistIconStyle}>
                            <Wishlist />
                        </View>
                    </View>
                    <View style={styles.CardContent}>
                        <Typography variant='title02'>{selectedItem.title}</Typography>
                        <Typography variant='body01'>{selectedItem.details}</Typography>

                        <View >
                            <Typography variant='title03'>{translate('add_ons')}</Typography>
                            <View style={styles.container}>
                                {selectedAddOns.map(({ id, label, quantity, checked }) => (
                                    <View key={id} style={styles.CustomCheckBoxStyles}>
                                        <CheckBox
                                            checked={checked}
                                            onChange={() => handlePress(id)}
                                        />
                                        <Typography variant='body02' style={{ marginLeft: SPACING.spacing02 }}>{label} {quantity}</Typography>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.priceContainer}>
                <View style={styles.incrementDecrementBtnStyle}>
                    <FontAwesome6 onPress={decrementQuantity} name="minus" size={16} color={colors.primary} />
                    <Typography variant={'title03'}>{quantity}</Typography>
                    <FontAwesome6 onPress={incrementQuantity} name="plus" size={16} color={colors.primary} />
                </View>
                <View style={styles.BuyButtonStyle}>
                    <Button onPress={navigateToPaymentMode}>{translate("add_item")} {formatPrice(Number(totalPrice.toFixed(2)))}</Button>
                </View>
            </View>
        </>
    );
};

export default ShakeDetails;

const getStyle = ({ colors }: StyleProps) => StyleSheet.create({
    CardContainer: {
        flex: 1,
        backgroundColor: colors.background
    },
    ImageStyle: {
        width: '100%',
        height: 'auto',
        aspectRatio: 1,
        borderRadius: RADIUS.large,
        resizeMode: 'cover',
    },
    wishlistIconStyle: {
        position: "absolute",
        right: SPACING.spacing04,
        bottom: SPACING.spacing04,
        padding: SPACING.spacing02,
        borderRadius: RADIUS.large,
        backgroundColor: colors.white,
    },
    CardContent: {
        marginVertical: SPACING.spacing03,
        paddingHorizontal: SPACING.spacing03,
        gap: SPACING.spacing03
    },
    priceContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.spacing02,
        paddingVertical: SPACING.spacing02,
        backgroundColor: colors.secondary
    },
    incrementDecrementBtnStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: SPACING.spacing03,
        borderWidth: 1,
        borderColor: colors.primary,
        padding: 6,
        borderRadius: RADIUS.full,
        paddingHorizontal: SPACING.spacing03
    },
    BuyButtonStyle: {
        flex: 1,
        alignItems: 'flex-end'
    },
    CustomCheckBoxStyles: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: SPACING.spacing01
    },
    container: {
        marginTop: SPACING.spacing02,
    },
});
