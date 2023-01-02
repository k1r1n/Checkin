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
import storage from '@react-native-firebase/storage';
import {Button} from '../components';

const {height} = Dimensions.get('window');

export const Setting = () => {
  const [mark, setMark] = useState({latitude: 13.7913, longitude: 100.5815});
  const [radius, setRadius] = useState(); // meter

  const onLocationChange = event => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    const currentLocation = {
      latitude,
      longitude,
    };

    setMark(currentLocation);
  };

  const onSetLocation = async () => {};

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
        // userLocationFastestInterval={10000}
        showsCompass>
        <Circle
          center={mark}
          radius={radius}
          strokeColor="hotpink"
          fillColor="rgba(255,150,180,0.4)"
        />
        <Marker draggable coordinate={mark} onDragEnd={onLocationChange} />
      </MapView>
      <View style={{backgroundColor: 'hotpink', width: '90%'}}>
        <Slider
          value={[1000]}
          step={100}
          onValueChange={value => setRadius(value)}
          minimumValue={0}
          maximumValue={30000}
          animateTransitions
          minimumTrackTintColor="#e6a954"
          thumbStyle={styles.thumb}
          trackStyle={styles.track}
        />
        {/* <Text>Value: {radius}</Text> */}
      </View>
      <Button title="SET" onPress={onSetLocation} />
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
});
