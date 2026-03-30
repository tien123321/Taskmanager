import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { ThemeContext } from '../../../hooks/theme';
import NotificationScreen from './Notification';
import Footer from '@/components/Footer/Footer';
import { useNavigation } from '@react-navigation/native';


const NotificationuserScreen = () => {
 const navigation = useNavigation();

  return (
        <View style={{width:"100%",height:"100%"}}>
            <NotificationScreen/>
            <Footer navigation={navigation} />
        </View>
  );
};

export default NotificationuserScreen;
