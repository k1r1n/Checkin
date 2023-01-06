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
import IoniconsIcons from 'react-native-vector-icons/Ionicons'
import { INITIAL_REGION, ROUTER_PATH } from '../../constants'
import { styles } from './styles'

export const History = ({ navigation }) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [showData, setShowData] = useState()

  useEffect(() => {
    const subscriber = firestore()
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

    return () => subscriber()
  }, [])

  const onPress = item => {
    setShowData(item)
  }

  const renderList = ({ item }) => (
    <TouchableOpacity style={styles.box} onPress={() => onPress(item)}>
      <Image style={styles.image} source={{ uri: item.image }} />
    </TouchableOpacity>
  )

  const renderDate = () => {
    return (
      <Text style={styles.title}>
        Created: ${new Date(showData.timestamp).toDateString()} $
        {new Date(showData.timestamp).toLocaleTimeString()} at
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
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate(ROUTER_PATH.CHECK_IN)}>
          <IoniconsIcons name='chevron-back-circle' size={32} color='orange' />
        </TouchableOpacity>
        <Text style={styles.route}>History</Text>
      </View>
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
              source={{ uri: showData?.image }}
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
