import { Dimensions, StyleSheet } from 'react-native'

const { height } = Dimensions.get('window')

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    position: 'relative',
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
})
