import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { Slider } from '@miblanchard/react-native-slider'
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps'
import firestore from '@react-native-firebase/firestore'
import { Button, Header } from '../../components'
import { COLORS, INITIAL_REGION, ROUTER_PATH } from '../../constants'
import { styles } from './styles'

export const Setting = ({ navigation }) => {
  const [mark, setMark] = useState()
  const [radius, setRadius] = useState([0])

  useEffect(() => {
    const subscriber = firestore()
      .collection('setting')
      .doc('distance')
      .onSnapshot(documentSnapshot => {
        const { radius: areaRadius, location } = documentSnapshot.data()

        setMark(location)
        setRadius([areaRadius])
      })
    return () => subscriber()
  }, [])

  const onLocationChange = event => {
    const { latitude, longitude } = event.nativeEvent.coordinate
    const currentLocation = {
      latitude,
      longitude,
    }

    setMark(currentLocation)
  }

  const onSetLocation = async () => {
    const settingCollection = await firestore()
      .collection('setting')
      .doc('distance')

    settingCollection.update({
      location: {
        latitude: mark.latitude,
        longitude: mark.longitude,
      },
      radius: Number(radius),
    })
  }

  return (
    <View style={styles.container}>
      <Header
        title='Setting'
        onBack={() => navigation.navigate(ROUTER_PATH.CHECK_IN)}
      />
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
                strokeColor={COLORS.ORANGE}
                fillColor={COLORS.ORANGE_AREA}
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
            minimumValue={100}
            maximumValue={10000}
            animateTransitions
            minimumTrackTintColor={COLORS.YELLOW}
            thumbStyle={styles.thumb}
            trackStyle={styles.track}
          />
          <Button title='SET' onPress={onSetLocation} />
        </View>
      </View>
    </View>
  )
}
