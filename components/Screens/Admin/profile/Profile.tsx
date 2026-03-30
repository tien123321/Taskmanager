import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Icon, Text, Layout } from '@ui-kitten/components';
import Footer from '@/components/Footer/FooterAdmin';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { ThemeContext } from '../../../../hooks/theme';

const Profile = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const navigation = useNavigation();
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    setAvatar(
      user?.avatar ||
        'https://antimatter.vn/wp-content/uploads/2022/05/background-xanh-duong-dam-dep.jpg'
    );
  }, [user]);

  const menuItems = [
    { icon: 'info-outline', title: 'Thông Tin', screen: 'UserDetails' },
    { icon: 'bell-outline', title: 'Thông báo', screen: 'HomeAd' },
    { icon: 'shield-outline', title: 'Đổi mật khẩu', screen: 'Forgotsubmit' },
    { icon: 'settings-2-outline', title: 'Cài Đặt', screen: 'SettingScreen' },
    { icon: 'question-mark-circle-outline', title: 'Giới Thiệu', screen: 'AboutScreen' },
  ];

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: () => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  return (
    <Layout style={[styles.container, { backgroundColor: isDarkMode ? '#1A2138' : '#f0f4f8' }]}>
      <View style={styles.header}>
        <Image
          source={{
            uri: 'https://antimatter.vn/wp-content/uploads/2022/05/background-xanh-duong-dam-dep.jpg',
          }}
          style={styles.background}
        />
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <Text category="h6" style={{ color: '#1a237e' }}>
          {user?.name}
        </Text>
        <Text appearance="hint" style={styles.warning}>
          {user?.story || ''}
        </Text>
      </View>

      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                { backgroundColor: isDarkMode ? '#222B45' : '#ffffff' },
              ]}
              onPress={() => item.screen && navigation.navigate(item.screen as never)}
            >
              <View style={styles.menuLeft}>
                <Icon
                  name={item.icon}
                  style={[styles.menuIcon, { tintColor: isDarkMode ? '#FF708D' : '#3f51b5' }]}
                />
                <Text style={[styles.menuText, { color: isDarkMode ? '#fff' : '#37474f' }]}>
                  {item.title}
                </Text>
              </View>
              <Icon
                name="arrow-ios-forward-outline"
                style={[styles.arrowIcon, { tintColor: isDarkMode ? '#8F9BB3' : '#90a4ae' }]}
              />
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[
              styles.logoutButton,
              {
                backgroundColor: isDarkMode ? '#2E3A59' : '#ffebee',
                borderColor: '#ef5350',
              },
            ]}
            onPress={handleLogout}
          >
            <Icon
              name="log-out-outline"
              style={[styles.logoutIcon, { tintColor:isDarkMode ? '#fff' : '#c62828'}]}
            />
            <Text style={[styles.logoutText,{ color: isDarkMode ? '#fff' : '#37474f' }]}>Đăng xuất</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <Footer navigation={navigation} />
    </Layout>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#cfe3ff',
    paddingBottom: 24,
    paddingTop: 48,
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: 300,
    top: 0,
    resizeMode: 'cover',
    opacity: 0.15,
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 90,
    backgroundColor: '#ddd',
    marginBottom: 10,
    marginTop: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  warning: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 4,
     color: '#1a237e'
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    marginTop: 10,
    paddingBottom: 40,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 1,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eceff1',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
  },
  arrowIcon: {
    width: 20,
    height: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 30,
    marginHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
  },
  logoutIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  logoutText: {
    fontSize: 16,
    color: '#c62828',
    fontWeight: '600',
  },
});
