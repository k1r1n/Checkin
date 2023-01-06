import React from 'react'
import { Slider } from '@miblanchard/react-native-slider'
import { COLORS } from '../../constants'
import { styles } from './styles'

export const SliderComponent = ({
  value,
  step,
  onValueChange,
  minimumValue,
  maximumValue,
}) => (
  <Slider
    value={value}
    step={step}
    onValueChange={onValueChange}
    minimumValue={minimumValue}
    maximumValue={maximumValue}
    animateTransitions
    minimumTrackTintColor={COLORS.YELLOW}
    thumbStyle={styles.thumb}
    trackStyle={styles.track}
  />
)
