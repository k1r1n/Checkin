import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  PermissionsAndroid,
  TouchableOpacity,
  Text,
} from 'react-native';
import {getDistance, getPreciseDistance} from 'geolib';
import MapView, {Marker, Circle, PROVIDER_GOOGLE} from 'react-native-maps';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {Button} from '../components';

export const CheckIn = () => {
  const [distance, setDistance] = useState(0);
  const [openCamera, setOpenCamera] = useState(false);
  const mark = {latitude: 13.7913, longitude: 100.5815};
  const radius = 100; // meter
  const devices = useCameraDevices();
  const device = devices.front;
  const camera = useRef(null);

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
        setOpenCamera(true);
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

  const onCheckIn = async () => {
    requestCameraPermission();
  };

  const onCapture = async () => {
    const photo = await camera.current.takePhoto();
    const checkInCollection = await firestore().collection('checkin');
    const reference = storage().ref(photo.path.replace(/^.*[\\/]/, ''));
    await reference.putFile(photo.path);
    const url = await reference.getDownloadURL();

    checkInCollection
      .add({
        location: {
          latitude: mark.latitude,
          longitude: mark.longitude,
        },
        timestamp: Date.now(),
        image: url,
      })
      .then(() => {
        console.log('User added!');
      });

    setOpenCamera(false);
  };

  const renderCamera = () => {
    return (
      <>
        <TouchableOpacity style={styles.capture} onPress={onCapture} />
        <Camera
          ref={camera}
          style={styles.map}
          device={device}
          isActive
          photo
        />
      </>
    );
  };

  return (
    <View style={styles.container}>
      {device && openCamera && renderCamera()}
      {!openCamera && (
        <>
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
          {distance <= 0 && <Button title="CHECK IN" onPress={onCheckIn} />}
        </>
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
  capture: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    position: 'relative',
    borderRadius: 40,
    zIndex: 999,
    bottom: 20,
    borderWidth: 2,
    borderColor: 'hotpink',
  },
});
