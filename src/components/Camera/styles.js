import { StyleSheet } from 'react-native'
import { COLORS } from '../../constants'

export const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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
    backgroundColor: COLORS.WHITE,
  },
})
