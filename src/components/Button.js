import React from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'

export const Button = ({ onPress, title, isDisabled }) => (
  <TouchableOpacity
    style={[styles.btn, isDisabled && styles.disabled]}
    onPress={!isDisabled ? onPress : null}>
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  btn: {
    backgroundColor: 'orange',
    padding: 18,
    flex: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.5,
  },
})
