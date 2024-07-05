import { StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Typography from './Typography';
import { Feather } from '@expo/vector-icons';
import { RADIUS, SPACING } from '../theme';
import { StyleProps, useTheme } from '../context/ThemeProvider';
import { ScrollView } from 'react-native-gesture-handler';
import QRCode from 'react-native-qrcode-svg';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '../navigation/HomeScreenNavigation';
import { useCurrencyContext } from '../context/CurrencyProvider';
import CryptoJS from 'react-native-crypto-js';

type MyQRCodeRouteProps = RouteProp<HomeStackParamList, 'MyQRCode'>;

const MyQRCode: React.FC<{ route: MyQRCodeRouteProps }> = ({ route }) => {
    const { colors } = useTheme();
    const styles = getStyle({ colors });
    const { formatPrice } = useCurrencyContext();
    const { selectedItem, quantity, totalPrice, selectedAddOns } = route.params;
    const id = selectedItem.id;
    const paid = true;
    const price = formatPrice(totalPrice);
    const addOns = selectedAddOns.map((addOn: { label: any; quantity: any; }) => `${addOn.label}-${addOn.quantity}`).join(', ');
    const ShakeDetails = { id, quantity, price, addOns, paid }
    const [encryptedShakeDetails, setEncryptedShakeDetails] = useState('')

    useEffect(() => {
        const SECRET_KEY = process.env.EXPO_PUBLIC_ENCRYPTION_SECRET_KEY!
        const encryptData = (data: object) => {
            const jsonData = JSON.stringify(data);
            const encrypted = CryptoJS.AES.encrypt(jsonData, SECRET_KEY).toString();
            setEncryptedShakeDetails(encrypted)
        };
        encryptData(ShakeDetails)
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Typography variant='title03' style={{ fontWeight: '700' }}>Scan QR Code</Typography>
            <Typography variant='title04'>Please follow the instructions below to scan the QR code at the nearest Boltshaker machine</Typography>

            <View style={{ alignItems: 'center', marginVertical: SPACING.spacing03 }}>
                {
                    encryptedShakeDetails ? (
                        <View style={styles.qrStyle}>
                            <QRCode value={encryptedShakeDetails} size={180} />
                        </View>
                    ) : (
                        <Typography variant='title03'>Loading...</Typography>
                    )
                }

                <View style={styles.qrOptionStyle}>
                    <Feather name="share-2" size={20} color={colors.white} style={styles.iconStyle} />
                    <Feather name="save" size={20} color={colors.white} style={styles.iconStyle} />
                </View>
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
        </ScrollView>
    )
}

export default MyQRCode

const getStyle = ({ colors }: StyleProps) => StyleSheet.create({
    container: {
        padding: SPACING.spacing02,
        paddingHorizontal: SPACING.spacing03,
        gap: SPACING.spacing02
    },
    qrStyle: {
        width: 'auto',
        height: "auto",
        borderRadius: RADIUS.medium,
        padding: SPACING.spacing02,
        backgroundColor: colors.white
    },
    qrOptionStyle: {
        position: 'absolute',
        gap: SPACING.spacing03,
        right: SPACING.spacing01,
        top: SPACING.spacing01
    },
    iconStyle: {
        borderWidth: 2,
        borderColor: colors.primary,
        padding: SPACING.spacing01,
        alignSelf: 'center',
        backgroundColor: colors.primary,
        borderRadius: RADIUS.full,
        paddingTop: 7,
        paddingLeft: 7,
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
})
