import React from "react";
import { StyleSheet, View, Image, ScrollView, StatusBar, SafeAreaView } from 'react-native';
import { ProfileIcon } from '../../assets';
import { RADIUS, SPACING } from '../../theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Typography from '../../components/Typography';
import { type StyleProps, useTheme } from '../../context/ThemeProvider';
import OffersCarousel from "../../components/OffersCarousel";
import { OFFERS } from "../../mockData/OffersCarousel";
import Input from "../../components/TextInput";
import { useShakesContext } from "../../context/ShakeContext";
import ShakeList from "../../components/ShakeList";
import Button from "../../components/Button";
import DisplayShakes from "../../components/displayShake";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { colorScheme, colors } = useTheme();
  const styles = getStyles({ colors });
  const { searchTerm, setSearchTerm } = useShakesContext();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={colors.background} barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.logoStyle}>
            <Image source={require('../../assets/Images/BoltShakerLogo.png')} style={styles.logo} />
            <Typography variant='title02'>BOLTSHAKER</Typography>
          </View>
          <View style={styles.avatarContainer}>
            <ProfileIcon onPress={() => navigation.navigate('Setting' as never)} color={colors.icon} style={styles.IconStyle} />
          </View>
        </View>
        <View style={styles.searchContainer}>
          <Input
            style={[styles.searchInput]}
            placeholder='Search Juice Name'
            placeholderTextColor={colors.gray100}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <MaterialIcons name="search" size={24} color="black" style={styles.voiceSearchIcon} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <OffersCarousel images={OFFERS} />
          <View style={{padding:10}}>
            <Button onPress={() => navigation.navigate('CreateShake' as never)} children={'Create Shake'} />
          </View>
          {/* <ShakeList /> */}
          <DisplayShakes/>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const getStyles = ({ colors }: StyleProps) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: SPACING.spacing02,
  },
  headerContainer: {
    marginTop: SPACING.spacing03,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 4,
  },
  logo: {
    width: 40,
    height: 40,
    objectFit: 'contain',
  },
  avatarContainer: {},
  IconStyle: {
    width: 40,
    height: 40,
  },
  searchContainer: {
    paddingBottom: SPACING.spacing03
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderRadius: RADIUS.extra_small,
    marginVertical: SPACING.spacing02,
    zIndex: 1,
    borderWidth: 2,
    borderColor: colors.gray100,
    paddingLeft: SPACING.spacing03,
    backgroundColor: colors.inputBox,
  },
  voiceSearchIcon: {
    position: 'absolute',
    zIndex: 1,
    right: SPACING.spacing03,
    color: colors.icon,
    paddingTop: SPACING.spacing01,
    top: SPACING.spacing05
  },
});
