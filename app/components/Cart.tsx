import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { HomeStackParamList } from '../navigation/HomeScreenNavigation';
import { RADIUS, SPACING } from '../theme';
import Typography from './Typography';
import Button from './Button';
import { StyleProps, useTheme } from '../context/ThemeProvider';
// import RazorpayCheckout from 'react-native-razorpay';
import { useCurrencyContext } from '../context/CurrencyProvider';

type CartRouteProp = RouteProp<HomeStackParamList, 'Cart'>;
type AddOn = {
  id: string;
  label: string;
  quantity: number;
}


const Cart: React.FC<{ route: CartRouteProp }> = ({ route }) => {
  const { colors } = useTheme();
  const styles = getStyle({ colors });
  const { selectedItem, quantity, totalPrice, selectedAddOns } = route.params;
  const addons = selectedAddOns as AddOn[];
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const { currency, formatPrice } = useCurrencyContext();

  // const handleRazorpayPayment = () => {
  //   const razorpayKey = process.env.EXPO_PUBLIC_RAZORPAY_KEY!;

  //   const options = {
  //     description: 'Credits towards consultation',
  //     image: 'https://i.imgur.com/3g7nmJC.jpg',
  //     currency: currency,
  //     key: razorpayKey,
  //     amount: totalPrice * 100,
  //     name: 'Acme Corp',
  //     order_id: ' ',
  //     prefill: {
  //       email: 'gaurav.kumar@example.com',
  //       contact: '9191919191',
  //       name: 'Gaurav Kumar'
  //     },
  //     theme: { color: colors.primary }
  //   }

  //   RazorpayCheckout.open(options).then((data) => {
  //     alert(`Success: ${data.razorpay_payment_id}`);
  //   }).catch((error) => {
  //     alert(`Error: ${error.code} | ${error.description}`);
  //   });
  // }

  const navigateToPaidQR = () => {
    navigation.navigate('MyQRCode', {
      selectedItem,
      totalPrice,
      quantity,
      selectedAddOns
    });
  };

  const navigateToQR = () => {
    navigation.navigate('UnpaidQR', {
      selectedItem,
      totalPrice,
      quantity,
      selectedAddOns
    });
  };

  return (
    <View style={{ height: '100%', margin: SPACING.spacing02 }}>
      <TouchableOpacity style={styles.card} onPress={() => navigation.goBack()}>
        <Image
          source={{ uri: selectedItem.image }}
          style={styles.ImageStyle}
        />

        <View style={styles.itemContainer}>
          <Typography variant='title03'>{selectedItem.title}</Typography>
          <Typography variant='title04'>Qty: {quantity}</Typography>
          <Typography variant='title04'>Total: {formatPrice(Number(totalPrice.toFixed(2)))}</Typography>

          <View style={styles.addOnsContainer}>
            <Typography variant='title04'>Selected Add-Ons:</Typography>
            {addons.map((addOn, index) => (
              <Typography variant='body01' key={index}>{addOn.label} - {addOn.quantity}</Typography>
            ))}
          </View>
        </View>
      </TouchableOpacity>
      <View style={{ position: 'absolute', bottom: SPACING.spacing03, width: "100%", gap: 5 }}>
        {/* <Button onPress={handleRazorpayPayment}>Pay {formatPrice(totalPrice)}</Button> */}
        <Button onPress={navigateToPaidQR}>Pay Online</Button>
        <Button variant='secondary' onPress={navigateToQR} >Generate QR</Button>
      </View>
    </View>
  );
};

const getStyle = ({ colors }: StyleProps) => StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: SPACING.spacing02,
    padding: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: SPACING.spacing01,
    elevation: SPACING.spacing01,
    flexDirection: 'row',
    gap: SPACING.spacing03
  },
  ImageStyle: {
    flex: 2,
    width: '50%',
    height: 'auto',
    borderRadius: RADIUS.small,
    resizeMode: 'cover',
  },
  itemContainer: {
    flex: 2,
    justifyContent: 'space-between',
    marginBottom: SPACING.spacing02,
    padding: SPACING.spacing02
  },
  addOnsContainer: {
    marginTop: SPACING.spacing02,
  },
});

export default Cart;
