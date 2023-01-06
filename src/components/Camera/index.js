import React from 'react'
import { ActivityIndicator, View, TouchableOpacity } from 'react-native'
import { Camera } from 'react-native-vision-camera'
import { styles } from './styles'

export const CameraComponent = ({ loading, onCapture, device, cameraRef }) => {
  return (
    device && (
      <View style={styles.cameraContainer}>
        <TouchableOpacity style={styles.capture} onPress={onCapture} />
        <Camera
          ref={cameraRef}
          style={styles.map}
          device={device}
          isActive
          photo
        />
        {loading && <ActivityIndicator size='large' />}
      </View>
    )
  )
}
