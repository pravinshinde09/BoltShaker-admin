import React, { useState } from 'react';
import { View, Image, ScrollView, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '../navigation/HomeScreenNavigation';
import { StyleProps, useTheme } from '../context/ThemeProvider';
import { SPACING, RADIUS } from '../theme';
import Typography from './Typography';
import { useLanguage } from '../context/LocalizationContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ShakeFullDetailsProps {
  route: RouteProp<HomeStackParamList, 'ShakeFullDetails'>;
}

const ShakeFullDetails: React.FC<ShakeFullDetailsProps> = ({ route }) => {
  const { product, nutritionalDetails } = route.params;
  const { colors } = useTheme();
  const styles = getStyle({ colors });
  const { translate } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <ScrollView>
        <View style={styles.CardContainer}>
          <View>
            <Image
              source={{ uri: product.imageUrl }}
              style={styles.ImageStyle}
            />
          </View>
          <View style={styles.CardContent}>
            <Typography variant="title02">{product.title_en}</Typography>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Typography
                variant="body01"
                numberOfLines={4}
              >
                {product.details_en}
              </Typography>
            </TouchableOpacity>

            <View style={styles.nutritionCard}>
              <Typography variant="title03" style={styles.nutritionHeader}>{translate('nutrition_facts')}</Typography>
              <View style={styles.mainDivider} />
              <View style={styles.nutritionRow}>
                <Typography variant="body01">{translate('serving_size')}</Typography>
                <Typography variant="body01">{nutritionalDetails.size}</Typography>
              </View>
              <View style={styles.mainDivider} />
              <Typography variant="body01" style={styles.nutritionSubHeader}>{translate('amount_per_serving')}</Typography>
              <View style={styles.nutritionRow}>
                <Typography variant="body01">{translate('calories')}</Typography>
                <Typography variant="body01">{nutritionalDetails.calories}</Typography>
              </View>
              <View style={styles.nutritionRow}>
                <Typography variant="body01">{translate('fat')}</Typography>
                <Typography variant="body01">{nutritionalDetails.fat}</Typography>
              </View>
              <View style={styles.nutritionRow}>
                <Typography variant="body01">{translate('carbs')}</Typography>
                <Typography variant="body01">{nutritionalDetails.carbs}</Typography>
              </View>
              <View style={styles.nutritionRow}>
                <Typography variant="body01">{translate('protein')}</Typography>
                <Typography variant="body01">{nutritionalDetails.proteins}</Typography>
              </View>
              <View style={styles.nutritionRow}>
                <Typography variant="body01">{translate('salt')}</Typography>
                <Typography variant="body01">{nutritionalDetails.salt}</Typography>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <MaterialCommunityIcons
            onPress={() => { setModalVisible(false) }}
            name="close-circle"
            size={40}
            color="white"
            style={{ alignSelf: 'flex-end', marginRight: 8 }}
          />
          <View style={styles.modalContent}>
            <ScrollView>
              <Typography variant="title03" style={{ fontWeight: '700', paddingVertical: SPACING.spacing02 }}>
                {translate("shake_details")}:
              </Typography>
              <Typography variant="body01">
                {product.details_en}
              </Typography>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ShakeFullDetails;

const getStyle = ({ colors }: StyleProps) => StyleSheet.create({
  CardContainer: {
    flex: 1,
    backgroundColor: colors.background,
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
    gap: SPACING.spacing03,
  },
  priceContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.spacing02,
    paddingVertical: SPACING.spacing02,
    backgroundColor: colors.secondary,
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
    paddingHorizontal: SPACING.spacing03,
  },
  BuyButtonStyle: {
    flex: 1,
    alignItems: 'flex-end',
  },
  CustomCheckBoxStyles: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.spacing01,
  },
  container: {
    marginTop: SPACING.spacing02,
  },
  nutritionCard: {
    marginTop: SPACING.spacing03,
    padding: SPACING.spacing03,
    backgroundColor: colors.shakeDetailsCard,
    borderRadius: RADIUS.medium,
    borderWidth: 1,
    borderColor: colors.primary
  },
  nutritionHeader: {
    marginBottom: SPACING.spacing02,
    fontWeight: "700"
  },
  nutritionSubHeader: {
    marginVertical: SPACING.spacing01,
    fontWeight: "700"
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.spacing01,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.shakeDetailsCard,
    padding: SPACING.spacing03,
    borderTopLeftRadius: RADIUS.large,
    borderTopRightRadius: RADIUS.large,
    maxHeight: '50%',
  },
  mainDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    width: "100%",
  },
});
