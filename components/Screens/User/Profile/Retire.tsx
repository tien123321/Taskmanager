import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Icon } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../../../hooks/theme';

const AboutScreen = () => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';

  const styles = getStyles(isDarkMode);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>✨ Giới thiệu về ứng dụng</Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Task Manager App</Text> là ứng dụng giúp bạn
        quản lý công việc cá nhân một cách hiệu quả, đơn giản và trực quan. Với
        thiết kế thân thiện và các tính năng thông minh, ứng dụng hỗ trợ bạn
        theo dõi công việc hàng ngày, đánh dấu hoàn thành, theo dõi quá hạn và
        dễ dàng yêu cầu gia hạn.
      </Text>

      <Text style={styles.subTitle}>🎯 Tính năng nổi bật</Text>
      {[
        'Tạo và quản lý task một cách nhanh chóng.',
        'Nhắc nhở công việc đến hạn, quá hạn.',
        'Giao diện hiện đại, dễ sử dụng, tối ưu cho trải nghiệm người dùng.',
        'Chỉnh sửa thông tin người dùng và cập nhật ảnh đại diện cá nhân.',
        'Tính năng gia hạn công việc khi cần thêm thời gian xử lý.',
        'Tìm kiếm thông minh với từ khóa và đánh dấu nổi bật.',
      ].map((feature, index) => (
        <View key={index} style={styles.listItem}>
          <Icon
            name="checkmark-circle-2-outline"
            fill={isDarkMode ? '#81c784' : '#4caf50'}
            style={styles.icon}
          />
          <Text style={styles.listText}>{feature}</Text>
        </View>
      ))}

      <Text style={styles.subTitle}>💡 Mục tiêu phát triển</Text>
      <Text style={styles.paragraph}>
        Ứng dụng được phát triển nhằm:
        {'\n'}• Giúp người dùng cá nhân hóa công việc theo lịch trình riêng.
        {'\n'}• Nâng cao hiệu suất và khả năng tổ chức công việc hàng ngày.
        {'\n'}• Giảm thiểu việc quên hoặc bỏ sót các công việc quan trọng.
      </Text>

      <Text style={styles.subTitle}>👤 Thông tin liên hệ</Text>
      <Text style={styles.paragraph}>
        • <Text style={styles.bold}>Nhà phát triển:</Text> Phạm Xuân Tiến{'\n'}
        • <Text style={styles.bold}>Email:</Text> phamxuantientvndh@gmail.com{'\n'}
        • <Text style={styles.bold}>SĐT:</Text> 0583223751{'\n'}
        • <Text style={styles.bold}>Website:</Text> www.taskmanager.vn{'\n'}
        • <Text style={styles.bold}>FaceBook:</Text> https://www.facebook.com/tien.pham.728960/
      </Text>

      <Text style={styles.subTitle}>🤝 Cảm ơn bạn đã sử dụng ứng dụng!</Text>
      <Text style={styles.paragraph}>
        Chúng tôi luôn lắng nghe mọi góp ý để hoàn thiện ứng dụng tốt hơn mỗi
        ngày. Nếu bạn thấy ứng dụng hữu ích, hãy đánh giá 5⭐ và chia sẻ cho bạn
        bè cùng sử dụng nhé!
      </Text>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Quay lại</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AboutScreen;

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: isDarkMode ? '#1a2138' : '#f4f7fa',
      paddingBottom: 40,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: isDarkMode ? '#90caf9' : '#1e88e5',
      marginBottom: 16,
    },
    subTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDarkMode ? '#64b5f6' : '#1565c0',
      marginTop: 24,
      marginBottom: 8,
    },
    paragraph: {
      fontSize: 15,
      color: isDarkMode ? '#e0e0e0' : '#37474f',
      lineHeight: 22,
    },
    bold: {
      fontWeight: '600',
      color: isDarkMode ? '#ffffff' : '#263238',
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 10,
    },
    icon: {
      width: 20,
      height: 20,
      marginRight: 8,
      marginTop: 2,
    },
    listText: {
      flex: 1,
      fontSize: 15,
      color: isDarkMode ? '#cfd8dc' : '#455a64',
      lineHeight: 21,
    },
    backButton: {
      marginTop: 30,
      alignSelf: 'center',
      backgroundColor: isDarkMode ? '#3949ab' : '#1976d2',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    backButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });
