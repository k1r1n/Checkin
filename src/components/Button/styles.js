import { StyleSheet } from 'react-native'
import { COLORS } from '../../constants'

export const styles = StyleSheet.create({
  btn: {
    backgroundColor: COLORS.ORANGE,
    padding: 18,
    flex: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.5,
  },
})
