import React, { useState } from 'react';
import { StyleSheet, Image, View, TouchableOpacity, Modal } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { RADIUS, SPACING } from '../theme';
import { AntDesign } from '@expo/vector-icons';
import Button from './Button';
import ButtonGroup from './ButtonGroup';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Typography from './Typography';
import { useLanguage } from '../context/LocalizationContext';
import { StyleProps, useTheme } from '../context/ThemeProvider';

const OffersDetails = () => {
  const route = useRoute();
  const { selectedItem } = route.params as { selectedItem: any };
  const [showDiscountCode, setShowDiscountCode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const toggleDiscountCode = () => {
    setShowDiscountCode(prevState => !prevState);
  };

  const maskedDiscountCode = () => {
    if (selectedItem.code) {
      return showDiscountCode ? selectedItem.code : selectedItem.code.replace(/\S/g, 'X');
    } else {
      return '';
    }
  };

  const { translate } = useLanguage();
  const { colors } = useTheme();
  const styles = getStyle({ colors });

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: selectedItem.image }}
        style={styles.imageStyle}
      />
      <View style={styles.overlay}>
        <View style={styles.cardStyle}>
          <View style={styles.titleStyle}>
            <Typography variant='title02' style={{ fontWeight: '600' }}>{selectedItem.title}</Typography>
          </View>
          <View style={styles.discountCodeContainer}>
            <Typography variant='title04'>Code: {maskedDiscountCode()}</Typography>
            <View style={{ position: 'absolute', right: 10 }}>
              <Button onPress={toggleDiscountCode}>{showDiscountCode ? "Hide" : translate('show')}</Button>
            </View>
          </View>

          <View>
            <ButtonGroup align={'row'}>
              <Button onPress={() => { }}>{translate('gift_now')}</Button>
              <Button onPress={() => { }}>{translate('redeem')}</Button>
            </ButtonGroup>
          </View>

        </View>

        <View style={[styles.cardStyle, { gap: 30 }]}>
          <View style={styles.titleStyle}>
            <View style={styles.IconStyle}>
              <AntDesign name="calendar" size={24} style={styles.IconStyle} />
            </View>
            <Typography variant='title04' style={{ flex: 3, marginLeft: -20 }}>{translate('expires')}: {selectedItem.exp_date}</Typography>
          </View>

          <TouchableOpacity style={styles.titleStyle} onPress={() => setModalVisible(true)}>
            <View style={styles.IconStyle}>
              <AntDesign name="infocirlceo" size={22} style={styles.IconStyle} />
            </View>
            <Typography variant='title04' style={{ flex: 3, marginLeft: -20 }}>{translate('offers_details')}</Typography>
            <AntDesign name="down" size={24} color="#bf40bf" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View>
            <MaterialCommunityIcons
              onPress={() => { setModalVisible(false) }}
              name="close-circle"
              size={40}
              color="white"
              style={{ alignSelf: 'flex-end', marginRight: 8 }}
            />
            <View style={styles.modalContent}>
              <TouchableOpacity
                onPress={(event) => {
                  event.stopPropagation();
                }}
              >
                <Typography
                  variant='title03'
                  style={{ fontWeight: '800' }}
                >
                  {translate('offers_details')}
                </Typography>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={(event) => {
                  event.stopPropagation();
                }}
              >
                <Typography
                  variant='title04'
                >
                  {selectedItem.description}
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

    </ScrollView>
  );
};

export default OffersDetails;

const getStyle = ({ colors }: StyleProps) => StyleSheet.create({
  container: {
    backgroundColor: colors.background
  },
  imageStyle: {
    width: '100%',
    aspectRatio: 16 / 12,
    resizeMode: 'cover',
  },
  overlay: {
    justifyContent: 'center',
    alignItems: 'center',
    top: -60
  },
  cardStyle: {
    backgroundColor: colors.card,
    width: '92%',
    padding: SPACING.spacing03,
    borderRadius: RADIUS.small,
    marginVertical: SPACING.spacing02,
    gap: SPACING.spacing03,
    
    // Shadow properties for iOS
    shadowColor: colors.transparentBlack,
    shadowOffset: {
      width: 0,
      height: SPACING.spacing01,
    },
    shadowOpacity: 0.25,
    shadowRadius: SPACING.spacing01,

    // Elevation for Android
    elevation: SPACING.spacing01,
  },

  titleStyle: {
    flexDirection: 'row',
  },
  wishlistIconStyle: {
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: RADIUS.full,
    padding: SPACING.spacing02,
  },
  IconStyle: {
    flex: 1,
    color: colors.icon
  },
  discountCodeContainer: {
    backgroundColor: colors.inputBox,
    borderWidth:1,
    borderColor:colors.gray100,
    padding: SPACING.spacing03,
    marginTop: SPACING.spacing02,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.full
  },
  discountCodeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

  },
  modalContent: {
    backgroundColor: colors.gray100,
    padding: SPACING.spacing03,
    borderTopStartRadius: RADIUS.large,
    gap: SPACING.spacing02,
    borderTopEndRadius: RADIUS.large,
  },
});
