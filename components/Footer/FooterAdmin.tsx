import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon, useTheme } from '@ui-kitten/components';

const Footer = ({ navigation }: { navigation: any }) => {
  const theme = useTheme(); // ✅ lấy theme
  const [activePage, setActivePage] = useState('MyTask');
  const [render, setRender] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', (e: any) => {
      const routeName = e.data.state.routes[e.data.state.index].name;
      setActivePage(routeName);
    });

    if (render !== '') {
      setRender(activePage);
      handleNavigation('Home');
    }

    return unsubscribe;
  }, [navigation, render]);

  const handleNavigation = (page: string) => {
    setActivePage(page);
    navigation.navigate(page);
  };

  const renderIcon = (name: string, isActive: boolean) => (
    <Icon
      name={name}
      fill={isActive ? theme['color-danger-500'] : theme['text-hint-color']}
      style={{ width: 24, height: 24 }}
    />
  );

  return (
    <View style={[styles.footer, { backgroundColor: theme['background-basic-color-1'], borderTopColor: theme['border-basic-color-3'] }]}>
      <TouchableOpacity
        style={styles.itemBottom}
        onPress={() => handleNavigation('HomeAd')}
      >
        {renderIcon('home-outline', activePage === 'HomeAd')}
        <Text style={[styles.textBottom, { color: activePage === 'HomeAd' ? theme['color-danger-500'] : theme['text-basic-color'] }]}>
          Trang Chủ
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.itemBottom}
        onPress={() => handleNavigation('ProjectsAd')}
      >
        {renderIcon('file-text-outline', activePage === 'ProjectsAd')}
        <Text style={[styles.textBottom, { color: activePage === 'ProjectsAd' ? theme['color-danger-500'] : theme['text-basic-color'] }]}>
          TaskList
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.itemBottom}
        onPress={() => handleNavigation('NotificationadScreen')}
      >
        {renderIcon('bell-outline', activePage === 'NotificationadScreen')}
        <Text style={[styles.textBottom, { color: activePage === 'NotificationadScreen' ? theme['color-danger-500'] : theme['text-basic-color'] }]}>
          Thông Báo
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.itemBottom}
        onPress={() => handleNavigation('AccountManagementScreen')}
      >
        {renderIcon('person-outline', activePage === 'AccountManagementScreen')}
        <Text style={[styles.textBottom, { color: activePage === 'AccountManagementScreen' ? theme['color-danger-500'] : theme['text-basic-color'] }]}>
          Account
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.itemBottom}
        onPress={() => handleNavigation('Profile')}
      >
        {renderIcon('person-outline', activePage === 'Profile')}
        <Text style={[styles.textBottom, { color: activePage === 'Profile' ? theme['color-danger-500'] : theme['text-basic-color'] }]}>
          My Account
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    borderTopWidth: 1,
  },
  itemBottom: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  textBottom: {
    marginTop: 2,
    fontSize: 12,
  },
});

export default Footer;
