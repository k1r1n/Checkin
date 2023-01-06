import { Dimensions, StyleSheet } from 'react-native'

const { width } = Dimensions.get('window')

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  map: {
    width: '100%',
    height: 200,
  },
  title: {
    paddingVertical: 10,
    fontSize: 16,
    color: '#1a3263',
  },
  image: {
    width: width / 3,
    height: width / 3,
  },
  selfie: {
    width: '100%',
    height: 400,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  box: {
    width: width / 3,
    height: width / 3,
  },
})
