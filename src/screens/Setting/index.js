import React, { useEffect, useState } from 'react'
import { View, Text, ToastAndroid } from 'react-native'
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps'
import firestore from '@react-native-firebase/firestore'
import { Button, Header, SliderComponent } from '../../components'
import { COLORS, INITIAL_REGION, ROUTER_PATH } from '../../constants'
import { styles } from './styles'

export const Setting = ({ navigation }) => {
  const [mark, setMark] = useState()
  const [radius, setRadius] = useState([0])

  useEffect(() => {
    getConfig()

    return () => getConfig()
  }, [])

  const getConfig = () => {
    firestore()
      .collection('setting')
      .doc('distance')
      .onSnapshot(documentSnapshot => {
        const { radius: areaRadius, location } = documentSnapshot.data()

        setMark(location)
        setRadius([areaRadius])
      })
  }

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

    ToastAndroid.showWithGravity(
      'Updated!',
      ToastAndroid.LONG,
      ToastAndroid.TOP,
    )
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
          <SliderComponent
            value={radius}
            step={100}
            onValueChange={value => setRadius(value)}
            minimumValue={100}
            maximumValue={10000}
          />
          <Button title='SET' onPress={onSetLocation} />
        </View>
      </View>
    </View>
  )
}
