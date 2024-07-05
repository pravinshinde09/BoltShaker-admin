import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, TextInput, Image, Linking, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { PinIcon } from "../../assets";
import { MACHINE_LOCATION, Machine } from "../../mockData/Locations";
import { RADIUS, SPACING } from "../../theme";
import Typography from "../../components/Typography";
import { StyleProps, useTheme } from "../../context/ThemeProvider";
import { MaterialIcons } from '@expo/vector-icons';

interface LatLng {
  latitude: number;
  longitude: number;
}

const MachineLocation: React.FC = () => {
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedMachineLocation, setSelectedMachineLocation] =
    useState<LatLng | null>(null);
  const [nearestMachine, setNearestMachine] = useState<Machine | null>(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        } else {
          console.log("Location permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (userLocation) {
      const distances = MACHINE_LOCATION.map((machine) => ({
        ...machine,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          machine.latitude,
          machine.longitude
        ),
      }));
      const nearestMachine = distances.reduce((prev, current) =>
        prev.distance < current.distance ? prev : current
      );
      setNearestMachine(nearestMachine);
    }
  }, [userLocation]);

  const handleMachineSelection = (machine: Machine) => {
    setSelectedMachineLocation({
      latitude: machine.latitude,
      longitude: machine.longitude,
    });
    setNearestMachine(machine);
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c;
    return d;
  };

  const filteredMachines = useMemo(
    () =>
      MACHINE_LOCATION.filter((machine) =>
        machine.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );
  const { colors } = useTheme();
  const styles = getStyle({ colors });

  const openGoogleMaps = () => {
    if (userLocation && nearestMachine) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${nearestMachine.latitude},${nearestMachine.longitude}&travelmode=driving`;
      Linking.openURL(url);
    }
  };

  const openPhoneDialer = (phoneNumber: string) => {
    const formattedPhoneNumber = phoneNumber.replace(/\s/g, '');
    Linking.openURL(`tel:${formattedPhoneNumber}`)
      .catch(err => console.error('An error occurred', err));
  };


  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={
          selectedMachineLocation
            ? {
              latitude: selectedMachineLocation.latitude,
              longitude: selectedMachineLocation.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }
            : {
              latitude: userLocation?.latitude || 0,
              longitude: userLocation?.longitude || 0,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }
        }
      >
        {filteredMachines.map((machine) => (
          <Marker
            key={machine.id}
            coordinate={{
              latitude: machine.latitude,
              longitude: machine.longitude,
            }}
            title={machine.name}
            onPress={() => handleMachineSelection(machine)}
          >
            <PinIcon style={{ width: 35, height: 35 }} />
          </Marker>
        ))}
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Your Location"
            pinColor="red"
          />
        )}
      </MapView>
      <TextInput
        style={styles.searchInput}
        placeholder="Search machines..."
        placeholderTextColor={colors.primary}
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      {nearestMachine && (
        <View style={styles.addressContainer}>
          <View style={{ alignSelf: 'center', backgroundColor: "gray", width: 40, height: 3, borderRadius: RADIUS.full }}></View>
          <View style={styles.addressStyle}>

            <View style={styles.LogoContainer}>
              <View style={styles.IconStyle}>
                <Image source={require('../../assets/Images/BoltShakerLogo.png')} style={styles.logo} />
              </View>
            </View>

            <View style={{ flex: 5 }}>
              <Typography variant="title04" >
                {nearestMachine.name}
              </Typography>
              <Typography variant="body02" >{nearestMachine.address}</Typography>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

            <TouchableOpacity onPress={() => openPhoneDialer(nearestMachine.contactNo.toString())} style={styles.btnStyle}>
              <MaterialIcons name="call" size={22} color={colors.icon} />
              <Typography variant={"title04"} > {nearestMachine.contactNo}</Typography>
            </TouchableOpacity>

            <TouchableOpacity onPress={openGoogleMaps} style={styles.btnStyle}>
              <MaterialIcons name="assistant-direction" size={22} color={colors.icon} />
              <Typography variant={"title04"} > Directions </Typography>
            </TouchableOpacity>

          </View>
        </View>
      )}
    </View>
  );
};

const getStyle = ({ colors }: StyleProps) => StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchInput: {
    position: "absolute",
    top: SPACING.spacing07,
    left: SPACING.spacing03,
    right: SPACING.spacing03,
    height: SPACING.spacing07,
    borderRadius: SPACING.spacing02,
    backgroundColor: colors.white,
    paddingHorizontal: SPACING.spacing03,
    zIndex: 1,
    elevation: 3,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
  },
  addressContainer: {
    position: "absolute",
    bottom: 0,
    backgroundColor: colors.card,
    padding: SPACING.spacing02,
    paddingHorizontal: SPACING.spacing03,
    elevation: SPACING.spacing01,
    justifyContent: "space-between",
    borderTopEndRadius: SPACING.spacing05,
    borderTopStartRadius: SPACING.spacing05,
    width: "100%",
    gap: SPACING.spacing03
  },
  addressStyle: {
    flexDirection: "row",
    justifyContent: 'space-between'
  },
  IconStyle: {
    padding: SPACING.spacing01,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: RADIUS.full,
    width: 36,
    height: 36
  },
  LogoContainer: {
    flex: 1,
  },
  logo: {
    width: "100%",
    height: "100%",
    objectFit: 'contain',
  },
  btnStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.spacing01,
    borderColor: "red",
    borderWidth: 1,
    padding: SPACING.spacing02,
    borderRadius: RADIUS.full
  }
});

export default MachineLocation;
