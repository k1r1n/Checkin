import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import {Slider} from '@miblanchard/react-native-slider';
import MapView, {Marker, Circle, PROVIDER_GOOGLE} from 'react-native-maps';
import IoniconsIcons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import {Button} from '../components';
import {INITIAL_REGION} from '../constants';

const {height} = Dimensions.get('window');

export const Setting = ({navigation}) => {
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('check-in')}>
          <IoniconsIcons name="chevron-back-circle" size={32} color="orange" />
        </TouchableOpacity>
        <Text style={styles.route}>Setting</Text>
      </View>
      <View style={styles.viewMap}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={INITIAL_REGION}
          showsUserLocation
          showsCompass>
          {mark && (
            <>
              <Circle
                center={mark}
                radius={Number(radius)}
                strokeColor="orange"
                fillColor="rgba(255,165,0,0.4)"
              />
              <Marker
                draggable
                coordinate={mark}
                onDragEnd={onLocationChange}
              />
            </>
          )}
        </MapView>
      </View>
      <View style={styles.detail}>
        <View style={styles.slider}>
          <Text style={styles.title}>Radius: {Number(radius) / 1000} km</Text>
          <Slider
            value={radius}
            step={100}
            onValueChange={value => setRadius(value)}
            minimumValue={0}
            maximumValue={10000}
            animateTransitions
            minimumTrackTintColor="#fab95b"
            thumbStyle={styles.thumb}
            trackStyle={styles.track}
          />
          <Button title="Assigned" onPress={onSetLocation} />
        </View>
      </View>
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
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  route: {
    marginHorizontal: 10,
    fontSize: 28,
    color: '#1a3263',
  },
  viewMap: {
    width: '100%',
    height,
    overflow: 'hidden',
    borderRadius: 30,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  thumb: {
    backgroundColor: 'orange',
    borderColor: 'orange',
    borderRadius: 2,
    height: 25,
    width: 25,
  },
  track: {
    backgroundColor: '#fff',
    borderColor: 'orange',
    borderRadius: 2,
    borderWidth: 1,
    height: 20,
  },
  slider: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a3263',
  },
  detail: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    height: 170,
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
});
