import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import NotificationScreen from '../../Notification/Notification';
import Footer from '@/components/Footer/FooterAdmin';
import { useNavigation } from '@react-navigation/native';


const NotificationadScreen = () => {
 const navigation = useNavigation();

  return (
        <View style={{width:"100%",height:"100%"}}>
            <NotificationScreen/>
            <Footer navigation={navigation} />
        </View>
  );
};

export default NotificationadScreen;
