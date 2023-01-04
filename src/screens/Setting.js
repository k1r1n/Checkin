import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import {Slider} from '@miblanchard/react-native-slider';
import {getDistance, getPreciseDistance} from 'geolib';
import MapView, {Marker, Circle, PROVIDER_GOOGLE} from 'react-native-maps';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import firestore from '@react-native-firebase/firestore';
import {Button} from '../components';
import {INITIAL_REGION} from '../constants';

const {height} = Dimensions.get('window');

export const Setting = () => {
  const [mark, setMark] = useState();
  const [radius, setRadius] = useState([0]); // meter

  useEffect(() => {
    const subscriber = firestore()
      .collection('setting')
      .doc('distance')
      .onSnapshot(documentSnapshot => {
        const {radius: areaRadius, location} = documentSnapshot.data();

        setMark(location);
        setRadius([areaRadius]);
      });
    return () => subscriber();
  }, []);

  const onLocationChange = event => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    const currentLocation = {
      latitude,
      longitude,
    };

    setMark(currentLocation);
  };

  const onSetLocation = async () => {
    const settingCollection = await firestore()
      .collection('setting')
      .doc('distance');

    settingCollection
      .update({
        location: {
          latitude: mark.latitude,
          longitude: mark.longitude,
        },
        radius: Number(radius),
      })
      .then(() => {
        console.log('set position');
      });
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={INITIAL_REGION}
        // showsMyLocationButton={true}
        showsUserLocation
        // userLocationPriority="high"
        // userLocationUpdateInterval={1000}
        // userLocationFastestInterval={10000}
        showsCompass>
        {mark && (
          <>
            <Circle
              center={mark}
              radius={Number(radius)}
              strokeColor="hotpink"
              fillColor="rgba(255,150,180,0.4)"
            />
            <Marker draggable coordinate={mark} onDragEnd={onLocationChange} />
          </>
        )}
      </MapView>
      <View style={styles.slider}>
        <Slider
          value={radius}
          step={100}
          onValueChange={value => setRadius(value)}
          minimumValue={0}
          maximumValue={10000}
          animateTransitions
          minimumTrackTintColor="#e6a954"
          thumbStyle={styles.thumb}
          trackStyle={styles.track}
        />
        <Text>Distance: {Number(radius) / 1000} km</Text>
      </View>
      <Button title="Assigned" onPress={onSetLocation} />
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
    height: height - 300,
  },
  thumb: {
    backgroundColor: '#eaeaea',
    borderColor: '#9a9a9a',
    borderRadius: 2,
    borderWidth: 1,
    height: 20,
    width: 20,
  },
  track: {
    backgroundColor: '#fff',
    borderColor: '#9a9a9a',
    borderRadius: 2,
    borderWidth: 1,
    height: 14,
  },
  slider: {
    width: '90%',
  },
});
