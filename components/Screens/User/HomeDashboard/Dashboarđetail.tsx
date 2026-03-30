import React, { useState, useContext } from 'react';
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Layout, Text, Button } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../../../../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { deleteProject } from '@/Service/ProjectService';
import { clearProject } from '../../../../redux/slide/projectslide';
import { ThemeContext } from '../../../../hooks/theme';  // Import ThemeContext

const FullScreenLoader = () => (
  <View style={styles.loadingOverlay}>
    <ActivityIndicator size="large" color="#fff" />
    <Text style={styles.loadingText}>Đang xử lý...</Text>
  </View>
);

const Projectdetailuser = () => {
  const dispatch = useDispatch();
  const ProjectDetail = useSelector((state: RootState) => state.project.project);
  const [isLoading, setIsLoading] = useState(false);

  const { theme } = useContext(ThemeContext);  // Get theme context
  const isDarkMode = theme === 'dark';  // Determine if it's dark mode or not

  const sampleProject = {
    projectId: ProjectDetail?.projectId,
    projectName: ProjectDetail?.projectName,
    creator: ProjectDetail?.creator,
    startDate: ProjectDetail?.startDate,
    endDate: ProjectDetail?.endDate,
    description: ProjectDetail?.description,
    link: ProjectDetail?.link,
    projectImage: ProjectDetail?.projectImage,
  };

  const navigation = useNavigation();

  const handleOpenLink = (url: string) => {
    if (url) {
      Linking.openURL(url).catch((err) => {
        console.error("Failed to open URL:", err);
      });
    }
  };

 

  const handleViewTasks = () => {
    navigation.navigate("MyTask");
  };

  return (
    <Layout style={[styles.layout, { backgroundColor: isDarkMode ? '#121212' : '#e0f7fa' }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Text style={[styles.backText, { color: isDarkMode ? '#fff' : '#2E3A59' }]}>← Quay lại</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerCenter}>
          <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#222B45' }]}>Chi tiết Dự Án</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Image */}
        <Image source={{ uri: sampleProject.projectImage }} style={styles.image} />

        {/* Thông tin dự án */}
        <View style={styles.textBox}>
          <Text style={[styles.text, { color: isDarkMode ? '#fff' : '#2E3A59' }]}>Mã dự án: {sampleProject.projectId || 'ID ẩn'}</Text>
        </View>

        <View style={styles.textBox}>
          <Text style={[styles.text, { color: isDarkMode ? '#fff' : '#2E3A59' }]}>Tên dự án: {sampleProject.projectName || 'Name ẩn'}</Text>
        </View>

        <View style={styles.textBox}>
          <Text style={[styles.text, { color: isDarkMode ? '#fff' : '#2E3A59' }]}>Người tạo dự án: {sampleProject.creator || 'Người ẩn danh'}</Text>
        </View>

        <View style={styles.textBox}>
          <Text style={[styles.text, { color: isDarkMode ? '#fff' : '#2E3A59' }]}>Ngày khởi tạo: {sampleProject.startDate || 'Lỗi'}</Text>
        </View>

        <View style={styles.textBox}>
          <Text style={[styles.text, { color: isDarkMode ? '#fff' : '#2E3A59' }]}>Ngày kết thúc: {sampleProject.endDate || 'Lỗi'}</Text>
        </View>

        <View style={styles.textBox}>
          <Text style={[styles.text, { color: isDarkMode ? '#fff' : '#2E3A59' }]}>Mô tả dự án:</Text>
          <Text style={[styles.text, styles.textdes, { color: isDarkMode ? '#fff' : '#2E3A59' }]}>{sampleProject.description || 'Lỗi'}</Text>
        </View>

        <View style={styles.textBox}>
          <Text style={[styles.text, { color: isDarkMode ? '#fff' : '#2E3A59' }]}>
            Tài liệu dự án:{' '}
            {sampleProject.link ? (
              <Text
                style={[styles.link, { color: isDarkMode ? '#0d47a1' : '#3366FF' }]}
                onPress={() => handleOpenLink(sampleProject.link || 'Lỗi')}
              >
                Xem tài liệu
              </Text>
            ) : (
              'Không có'
            )}
          </Text>
        </View>

        {/* Text "Xem Task Dự Án" */}
        <View style={styles.viewTaskTextContainer}>
          <Text style={[styles.viewTaskText, { color: isDarkMode ? '#ff7043' : 'red' }]} onPress={handleViewTasks}>
            Xem Task Dự Án
          </Text>
        </View>

        
      </ScrollView>

      {isLoading && <FullScreenLoader />}
    </Layout>
  );
};

const styles = StyleSheet.create({
  layout: { flex: 1, width: '100%' },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  headerLeft: {
    alignSelf: 'flex-start',
  },
  headerCenter: {
    alignItems: 'center',
    marginTop: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container: {
    padding: 20,
  },
  textBox: {
    padding: 4,
  },
  text: {
    fontSize: 16,
  },
  textdes: {
    marginLeft: 8,
  },
  link: {
    textDecorationLine: 'underline',
  },
  viewTaskTextContainer: {
    alignItems: 'flex-end',
    marginTop: 20,
    marginBottom: 5,
  },
  viewTaskText: {
    textDecorationLine: 'underline',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  actionButton: {
    flex: 1,
    borderRadius: 10,
    borderColor: 'transparent',
    paddingVertical: 12,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#D6E4FF',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingText: {
    marginTop: 12,
    color: '#fff',
    fontSize: 16,
  },
});

export default Projectdetailuser;
