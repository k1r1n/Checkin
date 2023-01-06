import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import IoniconsIcons from 'react-native-vector-icons/Ionicons'
import { styles } from './styles'
import { COLORS } from '../../constants'

export const Header = ({ title, onBack }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onBack}>
      <IoniconsIcons
        name='chevron-back-circle'
        size={32}
        color={COLORS.ORANGE}
      />
    </TouchableOpacity>
    <Text style={styles.route}>{title}</Text>
  </View>
)
