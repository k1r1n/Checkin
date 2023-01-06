import { PermissionsAndroid, Linking } from 'react-native'

export const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    )
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      Linking.openSettings()
    }
  } catch (err) {
    console.warn(err)
  }
}

export const requestCameraPermission = async onGranted => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      onGranted()
    } else {
      Linking.openSettings()
    }
  } catch (err) {
    console.warn(err)
  }
}
