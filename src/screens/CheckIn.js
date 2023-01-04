import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  PermissionsAndroid,
  TouchableOpacity,
  Text,
  Dimensions,
  Linking,
  ActivityIndicator,
} from 'react-native';
import {getPreciseDistance} from 'geolib';
import MapView, {Marker, Circle, PROVIDER_GOOGLE} from 'react-native-maps';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {Button} from '../components';
import {INITIAL_REGION} from '../constants';

const {height} = Dimensions.get('window');

export const CheckIn = ({navigation}) => {
  const [distance, setDistance] = useState(0);
  const [openCamera, setOpenCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mark, setMark] = useState();
  const [radius, setRadius] = useState(0);
  const devices = useCameraDevices();
  const device = devices.front;
  const camera = useRef(null);

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
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Linking.openSettings();
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
        Linking.openSettings();
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
    setLoading(true);

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
        setLoading(false);
        setOpenCamera(false);
      });
  };

  const renderCamera = () => {
    return (
      <View style={styles.cameraContainer}>
        <TouchableOpacity style={styles.capture} onPress={onCapture} />
        <Camera
          ref={camera}
          style={styles.map}
          device={device}
          isActive
          photo
        />
        {loading && <ActivityIndicator size="large" />}
      </View>
    );
  };

  const renderMeter = () => {
    if (distance > 1000) {
      return (
        <View style={styles.location}>
          <MaterialIcons name="place" size={32} color="orange" />
          <Text style={styles.title}>{distance / 1000}</Text>
          <Text style={styles.subtitle}>km to the destination</Text>
        </View>
      );
    }
    if (distance > 0 && distance < 1000) {
      return (
        <View style={styles.location}>
          <Text style={styles.title}>{distance / 1000}</Text>
          <Text style={styles.subtitle}>km to the destination</Text>
        </View>
      );
    }

    return (
      <View style={styles.location}>
        <MaterialIcons name="place" size={32} color="orange" />
        <Text style={styles.title}>0</Text>
        <Text style={styles.subtitle}>km to the destination</Text>
      </View>
    );
  };

  if (device && openCamera) {
    return renderCamera();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Check-in on the map</Text>
      {!openCamera && (
        <View style={styles.viewMap}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={INITIAL_REGION}
            userLocationFastestInterval={1000}
            onUserLocationChange={onUserLocationChange}
            showsUserLocation
            showsCompass>
            {mark && (
              <>
                <Circle
                  center={mark}
                  radius={radius}
                  strokeColor="orange"
                  fillColor="rgba(255,165,0,0.4)"
                />
                <Marker coordinate={mark} />
              </>
            )}
          </MapView>
        </View>
      )}
      {!openCamera && (
        <View style={styles.detail}>
          {renderMeter()}
          <View style={styles.checkIn}>
            <Button
              title="CHECK IN"
              onPress={onCheckIn}
              isDisabled={distance >= 0}
            />
            <View style={styles.navigation}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => {
                  navigation.navigate('history');
                }}>
                <MaterialIcons name="history" size={32} color="orange" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => {
                  navigation.navigate('setting');
                }}>
                <MaterialIcons name="settings" size={32} color="orange" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    position: 'relative',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a3263',
    alignSelf: 'flex-start',
  },
  viewMap: {
    width: '100%',
    height,
    overflow: 'hidden',
    borderRadius: 30,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  detail: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    height: 160,
    backgroundColor: '#fff',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 0,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    paddingBottom: 0,
    elevation: 10,
  },
  title: {
    color: '#1a3263',
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#999',
    marginHorizontal: 10,
    fontSize: 20,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  capture: {
    position: 'absolute',
    width: 80,
    bottom: 20,
    zIndex: 999,
    height: 80,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    borderColor: 'orange',
    borderWidth: 2,
    borderRadius: 40,
    backgroundColor: '#fff',
  },
  btn: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    shadowColor: 'rgba(0,0,0,0.5)',
    backgroundColor: '#fff',
    elevation: 3,
  },
  navigation: {
    width: 140,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
