import React, { StyleSheet, Text, TouchableOpacity } from "react-native";
import { ReactNode } from "react";
import { RADIUS, SPACING } from "../theme";
import { StyleProps, useTheme } from "../context/ThemeProvider";

type Variants = "primary" | "secondary" | "link";
type Props = {
  variant?: Variants;
  onPress: () => void;
  children: ReactNode;
  fullwidth?: boolean;
};
export default function Button({
  variant = "primary",
  onPress,
  children,
  fullwidth = false,
}: Props) {
  const { colors } = useTheme();

  const textStyles = getTextStyles({ colors });
  const btnStyles = getBtnStyles({ colors });
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        btnStyles.btn,
        btnStyles[variant],
        fullwidth && btnStyles.fullwidth,
      ]}
    >
      <Text style={[textStyles.text, textStyles[variant]]}>{children}</Text>
    </TouchableOpacity>
  );
}

const getTextStyles = ({ colors }: StyleProps) =>
  StyleSheet.create({
    text: {
      fontSize: 16,
      fontWeight: "500",
    },
    primary: {
      color: colors.white,
    },
    secondary: {
      color: colors.primary,
    },
    link: {},
  });

const getBtnStyles = ({ colors }: StyleProps) =>
  StyleSheet.create({
    fullwidth: {
      width: "100%",
    },
    btn: {
      borderWidth: 1,
      borderRadius: RADIUS.full,
      paddingTop: SPACING.spacing02,
      paddingBottom: SPACING.spacing02,
      paddingLeft: SPACING.spacing03,
      paddingRight: SPACING.spacing03,
      alignItems: "center",
    },
    primary: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    secondary: {
      backgroundColor: colors.white,
      borderColor: colors.primary,
    },
    link: {},
  });
