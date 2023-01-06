import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { COLORS } from '../../constants'
import { styles } from './styles'

export const Button = ({ onPress, title, icon, style, isDisabled }) => (
  <TouchableOpacity
    style={[styles.btn, isDisabled && styles.disabled, style && style]}
    onPress={!isDisabled ? onPress : null}>
    {title && <Text style={styles.text}>{title}</Text>}
    {icon && <MaterialIcons name={icon} size={32} color={COLORS.ORANGE} />}
  </TouchableOpacity>
)
