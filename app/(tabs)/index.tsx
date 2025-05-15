import { Image } from 'expo-image';
import { Button, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationStatus, setLocationStatus] = useState<Location.PermissionStatus>(Location.PermissionStatus.UNDETERMINED)
  const [locationButtonText, setLocationButtonText] = useState<string>("Grant permission");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const requestLocationPermissionsAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    setLocationStatus(status);
    let lbt = "";
    switch (status) {
      case Location.PermissionStatus.GRANTED:
        lbt = "Permission granted";
        break;
      case Location.PermissionStatus.UNDETERMINED:
        lbt = "Grant Location Permission";
        break;
      case Location.PermissionStatus.DENIED:
        lbt = "Location permission denied";
        break;
    }
    console.log("got: "+status+" transformed to: "+lbt);
    setLocationButtonText(lbt);
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }
  }

  const getCurrentLocation = async () => {
     await requestLocationPermissionsAsync() 

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  }

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const requestLocationPermissions = () => {
    requestLocationPermissionsAsync()
  }

  

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: give GPS permissions</ThemedText>
        <Button onPress={requestLocationPermissions} title={locationButtonText} 
        disabled={locationStatus !== Location.PermissionStatus.UNDETERMINED}
        />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore the data</ThemedText>
        <ThemedText>
          {`Tap the Data tab to watch your GPS positions and other interesting data.`}
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
