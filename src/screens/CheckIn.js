import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  PermissionsAndroid,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import {getPreciseDistance} from 'geolib';
import MapView, {Marker, Circle, PROVIDER_GOOGLE} from 'react-native-maps';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {Button} from '../components';
import {INITIAL_REGION} from '../constants';

const {height} = Dimensions.get('window');

export const CheckIn = () => {
  const [distance, setDistance] = useState(0);
  const [openCamera, setOpenCamera] = useState(false);
  const devices = useCameraDevices();
  const device = devices.front;
  const camera = useRef(null);
  const [mark, setMark] = useState();
  const [radius, setRadius] = useState(0);

  useEffect(() => {
    requestLocationPermission();

    const subscriber = firestore()
      .collection('setting')
      .doc('distance')
      .onSnapshot(documentSnapshot => {
        const {radius: areaRadius, location} = documentSnapshot.data();

        setMark(location);
        setRadius(areaRadius);
      });
    return () => subscriber();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
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
  };

  const calculateDistance = currentLocation => {
    var dis = getPreciseDistance(currentLocation, mark);

    setDistance(dis - radius);
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
        setOpenCamera(false);
      });
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

  const renderMeter = () => {
    if (distance > 1000) {
      return <Text>{distance / 1000} km from you</Text>;
    }
    if (distance > 0 && distance < 1000) {
      return <Text>{distance / 1000} km from you</Text>;
    }

    return <Text>Your in area</Text>;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Show on the map</Text>
      {device && openCamera && renderCamera()}
      {!openCamera && (
        <View style={styles.viewMap}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={INITIAL_REGION}
            userLocationFastestInterval={10000}
            onUserLocationChange={onUserLocationChange}
            showsUserLocation
            showsCompass>
            {mark && (
              <>
                <Circle
                  center={mark}
                  radius={radius}
                  strokeColor="hotpink"
                  fillColor="rgba(255,150,180,0.4)"
                />
                <Marker coordinate={mark} />
              </>
            )}
          </MapView>
        </View>
      )}
      <Text>Location</Text>
      {renderMeter()}
      {distance <= 0 && <Button title="CHECK IN" onPress={onCheckIn} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  viewMap: {
    width: '100%',
    height: height - 280,
    overflow: 'hidden',
    borderRadius: 30,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  title: {
    color: '#333',
    fontSize: 32,
    fontWeight: 'bold',
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
