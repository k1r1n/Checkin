import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import firestore from '@react-native-firebase/firestore';
import IoniconsIcons from 'react-native-vector-icons/Ionicons';
import {INITIAL_REGION, ROUTER_PATH} from '../constants';

const {width} = Dimensions.get('window');

export const History = ({navigation}) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showData, setShowData] = useState();

  useEffect(() => {
    const subscriber = firestore()
      .collection('checkin')
      .orderBy('timestamp', 'desc')
      .onSnapshot(querySnapshot => {
        let data = [];

        querySnapshot.forEach(documentSnapshot => {
          data = [
            ...data,
            {
              key: documentSnapshot.id,
              ...documentSnapshot.data(),
            },
          ];
        });

        setList(data);
        setLoading(false);
      });

    return () => subscriber();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  const onPress = item => {
    setShowData(item);
  };

  const renderList = ({item}) => (
    <TouchableOpacity style={styles.box} onPress={() => onPress(item)}>
      <Image style={styles.image} source={{uri: item.image}} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate(ROUTER_PATH.CHECK_IN)}>
          <IoniconsIcons name="chevron-back-circle" size={32} color="orange" />
        </TouchableOpacity>
        <Text style={styles.route}>History</Text>
      </View>
      <FlatList data={list} numColumns={3} renderItem={renderList} />
      {showData && (
        <Modal
          animationType="slide"
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
              resizeMode="cover"
              style={styles.selfie}
              source={{uri: showData?.image}}
            />
            <Text style={styles.title}>
              {`Created: ${new Date(
                showData.timestamp,
              ).toDateString()} ${new Date(
                showData.timestamp,
              ).toLocaleTimeString()} at`}
            </Text>

            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              region={{...INITIAL_REGION, ...showData.location}}
              minZoomLevel={17}
              moveOnMarkerPress={false}
              pitchEnabled={false}
              rotateEnabled={false}
              scrollEnabled={false}
              zoomEnabled={false}>
              <Marker coordinate={{...showData.location}} />
            </MapView>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
});
