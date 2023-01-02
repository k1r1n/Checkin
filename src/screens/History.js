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
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const {width} = Dimensions.get('window');

export const History = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriber = firestore()
      .collection('checkin')
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

  const renderList = ({item}) => (
    <TouchableOpacity style={styles.box}>
      <Image style={styles.image} source={{uri: item.image}} />
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <FlatList data={list} numColumns={3} renderItem={renderList} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    justifyContent: 'center',
  },
  image: {
    width: width / 3,
    height: width / 3,
  },
  box: {
    width: width / 3,
    height: width / 3,
  },
});
