import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { ThemeContext } from '../../../hooks/theme';
const notifications = [
  {
    id: '1',
    title: 'Cập nhật thành công',
    message: 'Nhiệm vụ "Học React Native" đã được cập nhật thành công!',
    time: new Date('2025-04-24T10:30:00'),
    Task:"0001"
  },
  {
    id: '2',
    title: 'Nhiệm vụ quá hạn',
    message: 'Bạn có một nhiệm vụ đã quá hạn: "Gửi báo cáo tuần".',
    time: new Date('2025-04-23T10:30:00'),
    Task:"0001"
  },
  {
    id: '3',
    title: 'Chào mừng!',
    message: 'Cảm ơn bạn đã sử dụng ứng dụng quản lý công việc.',
    time: new Date('2025-04-22T10:30:00'),
    Task:"0001"
  },
];

const NotificationScreen = () => {
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) {
      return 'Vừa xong';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else {
      return `${diffInDays} ngày trước`;
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={[styles.notificationItem, {
      backgroundColor: isDarkMode ? '#2E3A59' : '#F0F4FF',
      borderColor: isDarkMode ? '#3D4A6B' : '#C5D1F2'
    }]}>
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#1E2A5A' }]}>{item.title}</Text>
        <Text style={[styles.time, { color: isDarkMode ? '#ccc' : '#666' }]}>{formatTimeAgo(item.time)}</Text>
      </View>
      <Text style={[styles.message, { color: isDarkMode ? '#ccc' : '#444' }]}>{item.message}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }]}>
      <Text style={[styles.header, { color: isDarkMode ? '#fff' : '#1E2A5A' }]}>Thông báo</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  notificationItem: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 10,
  },
  time: {
    fontSize: 12,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default NotificationScreen;
