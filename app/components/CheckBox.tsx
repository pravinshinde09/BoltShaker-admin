import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { RADIUS, SPACING } from '../theme';
import { type Colors, useTheme } from '../context/ThemeProvider';
type Props = {
    checked: boolean;
    onChange: () => void;
}

export default function CheckBox({
    checked,
    onChange,
}: Props) {
    const { colors } = useTheme()
    const styles = getStyle({ colors })
    return (
        <TouchableOpacity onPress={onChange} style={[styles.checkBox, checked && styles.checkedBox]}>
            {checked && <FontAwesome5 name="check" size={14} color={colors.primary} />}
        </TouchableOpacity>
    )
}


const getStyle = ({ colors }: { colors: Colors}) => StyleSheet.create({
    checkBox: {
        width: 20,
        height: 20,
        borderRadius: RADIUS.extra_small,
        borderWidth: 1.5,
        borderColor: colors.icon,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.spacing02,
    },
    checkedBox: {
        borderColor: colors.primary,
    },
});

