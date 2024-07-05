import { SafeAreaView, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Typography from './Typography';
import { RADIUS, SPACING } from '../theme';
import { ScrollView } from 'react-native-gesture-handler';
import { StyleProps, useTheme } from '../context/ThemeProvider';
import Button from './Button';
import QRCode from 'react-native-qrcode-svg';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '../navigation/HomeScreenNavigation';
import CryptoJS from 'react-native-crypto-js';
import { useCurrencyContext } from '../context/CurrencyProvider';

type UnpaidQrRouteProp = RouteProp<HomeStackParamList, 'UnpaidQR'>;

const UnpaidQR: React.FC<{ route: UnpaidQrRouteProp }> = ({ route }) => {
    const { formatPrice } = useCurrencyContext();
    const { selectedItem, quantity, totalPrice, selectedAddOns } = route.params;
    const { colors } = useTheme();
    const styles = getStyle({ colors });
    const id = selectedItem.id;
    const paid = false;
    const price = formatPrice(totalPrice);
    const addOns = selectedAddOns.map((addOn: { label: any; quantity: any; }) => `${addOn.label}-${addOn.quantity}`).join(', ');

    const ShakeDetails = { id, quantity, price, addOns, paid };
    const [encryptedShakeDetails, setEncryptedShakeDetails] = useState('');

    useEffect(() => {
        const SECRET_KEY = process.env.EXPO_PUBLIC_ENCRYPTION_SECRET_KEY!
        const encryptData = (data: object) => {
            const jsonString = JSON.stringify(data);
            const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
            setEncryptedShakeDetails(encrypted);
        };

        encryptData(ShakeDetails);
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <SafeAreaView>
                <Typography variant='title03' style={{ fontWeight: '700', paddingBottom: SPACING.spacing02 }}>Scan QR Code</Typography>
                <Typography variant='title04'>Please follow the instructions below to scan the QR code at the nearest Boltshaker machine</Typography>

                <View style={styles.qrContainer}>
                    {encryptedShakeDetails ? (
                        <QRCode value={encryptedShakeDetails} size={180} />
                    ) : (
                        <Typography variant='title03'>Loading...</Typography>
                    )}
                </View>

                <Typography variant='body01' style={{ alignSelf: 'center' }}>OR</Typography>

                <View style={{ marginVertical: SPACING.spacing03 }}>
                    <Button onPress={() => { }}>Pay Online</Button>
                </View>

                <View style={styles.instructionsContainer}>
                    <Typography variant='title03' style={{ fontWeight: '700' }}>Follow below instructions</Typography>

                    <View style={styles.stepsContainer}>
                        <View style={styles.divider}></View>
                        <View style={styles.step}>
                            <View style={styles.stepNumber}>
                                <Typography variant='title03'>1</Typography>
                            </View>
                            <View style={styles.stepTextContainer}>
                                <Typography variant='body01' style={styles.stepText}>Open the built-in camera app.</Typography>
                            </View>
                        </View>
                        <View style={styles.step}>
                            <View style={styles.stepNumber}>
                                <Typography variant='title03'>2</Typography>
                            </View>
                            <View style={styles.stepTextContainer}>
                                <Typography variant='body01' style={styles.stepText}>Point the camera at the QR code.</Typography>
                            </View>
                        </View>
                        <View style={styles.step}>
                            <View style={styles.stepNumber}>
                                <Typography variant='title03'>3</Typography>
                            </View>
                            <View style={styles.stepTextContainer}>
                                <Typography variant='body01' style={styles.stepText}>Tap the banner that appears on your Android phone or tablet.</Typography>
                            </View>
                        </View>
                        <View style={styles.step}>
                            <View style={styles.stepNumber}>
                                <Typography variant='title03'>4</Typography>
                            </View>
                            <View style={styles.stepTextContainer}>
                                <Typography variant='body01' style={styles.stepText}>Follow the instructions on the screen to finish payment.</Typography>
                            </View>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
};

export default UnpaidQR;

const getStyle = ({ colors }: StyleProps) => StyleSheet.create({
    container: {
        padding: SPACING.spacing02,
        paddingHorizontal: SPACING.spacing03
    },
    qrContainer: {
        alignItems: 'center',
        marginVertical: SPACING.spacing03,
        backgroundColor: 'white',
        padding: SPACING.spacing02,
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: RADIUS.medium,
    },
    instructionsContainer: {
        marginBottom: SPACING.spacing04,

    },
    stepsContainer: {
        marginTop: SPACING.spacing02,
        position: 'relative',
        gap: SPACING.spacing03
    },
    step: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepNumber: {
        width: 32,
        height: 32,
        borderRadius: RADIUS.full,
        borderWidth: 1.5,
        borderColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.card
    },
    stepTextContainer: {
        flex: 1,
        marginLeft: SPACING.spacing02,
    },
    stepText: {
        lineHeight: 18
    },
    divider: {
        position: 'absolute',
        left: SPACING.spacing03,
        top: 2,
        bottom: 2,
        width: 2,
        backgroundColor: colors.black300,
    },
});
