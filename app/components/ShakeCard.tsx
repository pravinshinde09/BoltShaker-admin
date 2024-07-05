import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { RADIUS, SPACING } from "../theme";
import { HomeStackParamList } from "../navigation/HomeScreenNavigation";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Typography from "./Typography";
import { type StyleProps, useTheme } from "../context/ThemeProvider";
import { useCurrencyContext } from "../context/CurrencyProvider";
import { ShakesType } from "../types/shakeDetailsTypes";

type Props = {
  shakes: ShakesType[];
};

const ShakeCard = ({ shakes }: Props) => {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const { colors } = useTheme();
  const styles = getStyles({ colors });
  const { formatPrice } = useCurrencyContext();

  return (
    <View>
      {shakes.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.container}
          onPress={() =>
            navigation.navigate("ShakeDetails", { selectedItem: item })
          }
        >
          <Image source={{ uri: item.image }} style={styles.imageStyle} />
          <View style={styles.content}>
            <Typography variant="title03">{item.title}</Typography>
            <Typography numberOfLines={2} variant="body02">
              {item.details}
            </Typography>
            <Typography variant="title03">{formatPrice(item.price)}</Typography>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ShakeCard;

const getStyles = ({ colors }: StyleProps) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      marginVertical: SPACING.spacing02,
      gap: SPACING.spacing02,
      borderRadius: RADIUS.small,
      backgroundColor: colors.card,
    },
    imageStyle: {
      width: 100,
      height: 100,
      borderRadius: RADIUS.small,
      marginRight: SPACING.spacing02,
      resizeMode: "cover",
    },
    content: {
      flex: 1,
      padding: SPACING.spacing01,
    },
  });
