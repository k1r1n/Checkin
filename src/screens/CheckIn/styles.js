import { Dimensions, StyleSheet } from 'react-native'
import { COLORS } from '../../constants'
const { height } = Dimensions.get('window')

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    position: 'relative',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.INDIGO,
    alignSelf: 'flex-start',
  },
  viewMap: {
    width: '100%',
    height,
    overflow: 'hidden',
    borderRadius: 30,
  },
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
  },
  detail: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    height: 160,
    backgroundColor: COLORS.WHITE,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    padding: 20,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 5,
      height: 0,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    paddingBottom: 0,
    elevation: 10,
  },
  title: {
    color: COLORS.INDIGO,
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    color: COLORS.GRAY,
    marginHorizontal: 10,
    fontSize: 20,
    marginTop: 9,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btn: {
    padding: 12,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    shadowColor: COLORS.BTN_SHADOW,
    backgroundColor: COLORS.WHITE,
    elevation: 3,
  },
  navigation: {
    width: 140,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
})
