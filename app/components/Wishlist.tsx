import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeProvider';


const Wishlist = () => {
    const { colors } = useTheme();
    const [isWishlistClicked, setIsWishlistClicked] = useState(false);

    const handleWishlistClick = () => {
        setIsWishlistClicked(prevState => !prevState);
    };

    return (
        <TouchableOpacity onPress={handleWishlistClick}>
            {isWishlistClicked ? <Octicons name="heart-fill" size={24} color={colors.primary} /> :
                <FontAwesome5 name="heart" size={24} color={colors.black} />}
        </TouchableOpacity>
    );
};

export default Wishlist;

