import { Image } from 'expo-image';
import { Button, Platform, StyleSheet } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export default function DataTabScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  const getCurrentLocation = async () => {
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
      distanceInterval: 10, // in meters
      timeInterval: 5 * 1000, // milliseconds
      mayShowUserSettingsDialog: false,
    });
    console.log('location: '+JSON.stringify(location));
    setLocation(location);
  }

  useEffect(() => {
    getCurrentLocation()
  }, [])


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>

      <ThemedView >
        <ThemedText>Click the button below to request an update of the location data:</ThemedText>
        <Button title="Update Location Data" onPress={getCurrentLocation}></Button>
      </ThemedView>
      
      {location && (
        <>
          <Collapsible title="Coordinates">
            <ThemedText>Latitude: {location.coords.latitude}</ThemedText>
            <ThemedText>Longitude: {location.coords.longitude}</ThemedText>
            <ThemedText>Altitude: {location.coords.altitude ?? 'N/A'} meters</ThemedText>
            <ThemedText>Accuracy: {location.coords.accuracy} meters</ThemedText>
          </Collapsible>

          <Collapsible title="Movement">
            <ThemedText>Heading: {location.coords.heading ?? 'N/A'}°</ThemedText>
            <ThemedText>Speed: {location.coords.speed ?? 'N/A'} m/s</ThemedText>
          </Collapsible>

          <Collapsible title="Timestamp">
            <ThemedText>
              Time: {new Date(location.timestamp).toLocaleString()}
            </ThemedText>
          </Collapsible>
        </>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
