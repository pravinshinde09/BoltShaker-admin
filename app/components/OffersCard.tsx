import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { RADIUS, SPACING } from '../theme';
import { OffersType } from "../types/offerDetailsType";
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { OfferStackParamList } from '../navigation/OfferScreenNavigation';
import Typography from './Typography';
import { useLanguage } from '../context/LocalizationContext';
import { StyleProps, useTheme } from '../context/ThemeProvider';

type Props = {
  OffersData: OffersType[];
};

const OffersCard = ({ OffersData }: Props) => {
  const navigation = useNavigation<NavigationProp<OfferStackParamList>>();
  const { translate } = useLanguage();
  const { colors } = useTheme();
  const styles = getStyle({ colors });

  return (
    <View style={styles.container}>
      {OffersData.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.cardStyle}
          onPress={() => navigation.navigate('OffersDetails', { selectedItem: item })}
        >
          <View style={styles.content}>
            <Typography variant='title04'>{item.title}</Typography>
            <Typography variant='body02'>{translate('expires')}: {item.exp_date}</Typography>
          </View>
          <Image source={{ uri: item.image }} style={styles.imageStyle} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default OffersCard;

const getStyle = ({ colors }: StyleProps) => StyleSheet.create({
  container: {
    marginTop: SPACING.spacing02,
    backgroundColor: colors.background
  },
  cardStyle: {
    flexDirection: 'row',
    padding: SPACING.spacing03,
    backgroundColor: colors.card,
    borderRadius: RADIUS.medium,
    elevation: SPACING.spacing02,
    shadowColor: colors.transparentBlack,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: RADIUS.extra_small,
    marginHorizontal: SPACING.spacing03,
    marginVertical: SPACING.spacing02,
    alignItems: 'center',
  },
  imageStyle: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.small,
    resizeMode: "cover",
    borderWidth: 1,
  },
  content: {
    flex: 1,
    gap: SPACING.spacing02
  },
});
