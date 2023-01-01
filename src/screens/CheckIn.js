import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  PermissionsAndroid,
  TouchableOpacity,
  Text,
} from 'react-native';
import {getDistance, getPreciseDistance} from 'geolib';
import MapView, {Marker, Circle, PROVIDER_GOOGLE} from 'react-native-maps';

export const CheckIn = () => {
  const [distance, setDistance] = useState(0);
  const mark = {latitude: 13.7913, longitude: 100.5815};
  const radius = 100; // meter

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        // {
        //   title: 'Cool Photo App Camera Permission',
        //   message:
        //     'Cool Photo App needs access to your camera ' +
        //     'so you can take awesome pictures.',
        //   buttonNeutral: 'Ask Me Later',
        //   buttonNegative: 'Cancel',
        //   buttonPositive: 'OK',
        // },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const onUserLocationChange = event => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    const currentLocation = {
      latitude,
      longitude,
    };

    calculateDistance(currentLocation);
    console.log('User Location: ', latitude, longitude);
  };

  const calculateDistance = currentLocation => {
    var dis = getPreciseDistance(
      currentLocation,
      // {latitude: 13.7914, longitude: 100.5824}, // current
      mark, // mark
    );

    setDistance(dis - radius);
    console.log(
      `Distance\n\n${dis} Meter OR ${dis / 1000} KM = ${dis - radius}`,
    );
  };

  const onCheckIn = () => {
    requestCameraPermission();
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={{
          latitude: 13.7563,
          longitude: 100.5018,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        // showsMyLocationButton={true}
        showsUserLocation
        // userLocationPriority="high"
        // userLocationUpdateInterval={1000}
        userLocationFastestInterval={10000}
        showsCompass
        onUserLocationChange={onUserLocationChange}>
        <Circle
          center={mark}
          radius={radius}
          strokeColor="hotpink"
          fillColor="rgba(255,150,180,0.4)"
        />
        <Marker coordinate={mark} />
      </MapView>
      {distance <= 0 && (
        <TouchableOpacity style={styles.btn} onPress={onCheckIn}>
          <Text>CHECK IN</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  btn: {
    backgroundColor: 'skyblue',
    padding: 18,
    margin: 10,
    borderRadius: 10,
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
