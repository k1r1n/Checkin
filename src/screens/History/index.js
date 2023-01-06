import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import firestore from '@react-native-firebase/firestore'
import { Header } from '../../components'
import { INITIAL_REGION, ROUTER_PATH } from '../../constants'
import { styles } from './styles'

export const History = ({ navigation }) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [showData, setShowData] = useState()

  useEffect(() => {
    getHistory()

    return () => getHistory()
  }, [])

  const getHistory = () => {
    firestore()
      .collection('checkin')
      .orderBy('timestamp', 'desc')
      .onSnapshot(querySnapshot => {
        let data = []

        querySnapshot.forEach(documentSnapshot => {
          data = [
            ...data,
            {
              key: documentSnapshot.id,
              ...documentSnapshot.data(),
            },
          ]
        })

        setList(data)

        const timeOut = setTimeout(() => {
          setLoading(false)
          clearTimeout(timeOut)
        }, 300)
      })
  }

  const renderList = ({ item }) => {
    const { image } = item

    return (
      <TouchableOpacity style={styles.box} onPress={() => setShowData(item)}>
        <Image style={styles.image} source={{ uri: image }} />
      </TouchableOpacity>
    )
  }

  const renderDate = () => {
    const { timestamp } = showData
    const dateTime = new Date(timestamp)

    return (
      <Text style={styles.title}>
        Created: {dateTime.toDateString()}
        {dateTime.toLocaleTimeString()} at
      </Text>
    )
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header
        title='History'
        onBack={() => navigation.navigate(ROUTER_PATH.CHECK_IN)}
      />
      <FlatList data={list} numColumns={3} renderItem={renderList} />
      {showData && (
        <Modal
          animationType='slide'
          visible={true}
          transparent
          onRequestClose={() => setShowData(null)}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.centeredView}
            onPress={() => setShowData(null)}
          />

          <View style={styles.modalView}>
            <Image
              resizeMode='cover'
              style={styles.selfie}
              source={{ uri: showData.image }}
            />
            {renderDate()}
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              region={{ ...INITIAL_REGION, ...showData.location }}
              minZoomLevel={17}
              moveOnMarkerPress={false}
              pitchEnabled={false}
              rotateEnabled={false}
              scrollEnabled={false}
              zoomEnabled={false}>
              <Marker coordinate={{ ...showData.location }} />
            </MapView>
          </View>
        </Modal>
      )}
    </View>
  )
}
