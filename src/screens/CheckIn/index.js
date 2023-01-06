import React, { useEffect, useState, useRef } from 'react'
import { View, Text, ToastAndroid } from 'react-native'
import { getPreciseDistance } from 'geolib'
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps'
import { useCameraDevices } from 'react-native-vision-camera'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'
import { Button, Header, CameraComponent } from '../../components'
import { COLORS, INITIAL_REGION } from '../../constants'
import { requestLocationPermission, requestCameraPermission } from '../../utils'
import { styles } from './styles'

export const CheckIn = ({ navigation }) => {
  const [distance, setDistance] = useState(0)
  const [openCamera, setOpenCamera] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mark, setMark] = useState()
  const [radius, setRadius] = useState(0)
  const [userLocation, setUserLocation] = useState({})
  const devices = useCameraDevices()
  const device = devices.front
  const camera = useRef(null)

  useEffect(() => {
    requestLocationPermission()
    getLocation()
  }, [])

  const getLocation = () => {
    firestore()
      .collection('setting')
      .doc('distance')
      .onSnapshot(documentSnapshot => {
        const { radius: areaRadius, location } = documentSnapshot.data()

        setMark(location)
        setRadius(areaRadius)
      })
  }

  const onUserLocationChange = event => {
    const { latitude, longitude } = event.nativeEvent.coordinate
    const currentLocation = {
      latitude,
      longitude,
    }

    calculateDistance(currentLocation)
    setUserLocation(currentLocation)
  }

  const calculateDistance = currentLocation => {
    const dis = getPreciseDistance(currentLocation, mark)

    setDistance(dis - radius)
  }

  const onGrantedCamera = () => {
    setOpenCamera(true)
  }

  const onCheckIn = () => {
    requestCameraPermission(onGrantedCamera)
  }

  const onCapture = async () => {
    setLoading(true)

    const photo = await camera.current.takePhoto()
    const checkInCollection = await firestore().collection('checkin')
    const reference = storage().ref(photo.path.replace(/^.*[\\/]/, ''))
    await reference.putFile(photo.path)
    const url = await reference.getDownloadURL()

    checkInCollection
      .add({
        location: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        },
        timestamp: Date.now(),
        image: url,
      })
      .then(() => {
        setLoading(false)
        setOpenCamera(false)
        ToastAndroid.showWithGravity(
          'Successfully',
          ToastAndroid.LONG,
          ToastAndroid.TOP,
        )
      })
  }

  const onNavigate = routerName => {
    navigation.navigate(routerName)
  }

  const renderMeter = () => {
    const distanceInKm = distance / 1000
    const distanceLabel = distance > 0 ? distanceInKm : 0
    const unit = distance >= 1000 ? 'km' : 'm'

    return (
      <View style={styles.location}>
        <MaterialIcons name='place' size={32} color={COLORS.ORANGE} />
        <Text style={styles.title}>
          {distanceLabel} {unit}
        </Text>
        <Text style={styles.subtitle}>to the destination</Text>
      </View>
    )
  }

  if (device && openCamera) {
    return (
      <CameraComponent
        onCapture={onCapture}
        cameraRef={camera}
        style={styles.fullScreen}
        device={device}
        loading={loading}
      />
    )
  }

  return (
    <View style={styles.container}>
      <Header title='Check-in on the map' />
      <View style={styles.viewMap}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.fullScreen}
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
                strokeColor={COLORS.ORANGE}
                fillColor={COLORS.ORANGE_AREA}
              />
              <Marker coordinate={mark} />
            </>
          )}
        </MapView>
      </View>
      <View style={styles.detail}>
        {renderMeter()}
        <View style={styles.checkIn}>
          <Button
            title='CHECK IN'
            onPress={onCheckIn}
            isDisabled={distance >= 0}
          />
          <View style={styles.navigation}>
            <Button
              style={styles.btn}
              icon='history'
              onPress={() => onNavigate('history')}
            />
            <Button
              style={styles.btn}
              icon='settings'
              onPress={() => onNavigate('setting')}
            />
          </View>
        </View>
      </View>
    </View>
  )
}
