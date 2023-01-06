import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import IoniconsIcons from 'react-native-vector-icons/Ionicons'
import { COLORS } from '../../constants'
import { styles } from './styles'

export const Header = ({ title, onBack = null }) => (
  <View style={styles.header}>
    {onBack && (
      <TouchableOpacity onPress={onBack}>
        <IoniconsIcons
          name='chevron-back-circle'
          size={32}
          color={COLORS.ORANGE}
        />
      </TouchableOpacity>
    )}
    <Text style={styles.route}>{title}</Text>
  </View>
)
