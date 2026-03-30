import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import Footer from '../../../Footer/FooterAdmin';
import { useNavigation } from '@react-navigation/native';
import { getAllProjects } from "../../../../Service/ProjectService";
import { ProjectModal } from '@/Modal/ProjectModal';
import { useDispatch } from 'react-redux';
import { setProject } from '../../../../redux/slide/projectslide';
import { ThemeContext } from '../../../../hooks/theme'; // Import useTheme

const FullScreenLoader = () => (
  <View style={styles.loadingOverlay}>
    <ActivityIndicator size="large" color="#fff" />
    <Text style={styles.loadingText}>Đang xử lý...</Text>
  </View>
);

const TaskProject = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
    const isDarkMode = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState<ProjectModal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const allProjects = await getAllProjects();
        setProjects(allProjects);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách dự án:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) =>
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <View style={styles.content}>
        <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>Danh sách Dự án</Text>

        <TextInput
          style={[styles.searchInput, isDarkMode ? styles.darkInput : styles.lightInput]}
          placeholder="Tìm kiếm dự án..."
          placeholderTextColor={isDarkMode ? '#ccc' : '#888'}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />

        <FlatList
          data={filteredProjects}
          keyExtractor={(item) => item.projectId}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.projectItem, isDarkMode ? styles.darkItem : styles.lightItem]}
              onPress={() => {
                dispatch(setProject(item));
                navigation.navigate('TaskList');
              }}
            >
              <Text style={[styles.projectId, isDarkMode ? styles.darkText : styles.lightText]}>
                Mã dự án: {item.projectId}
              </Text>
              <Text style={[styles.projectName, isDarkMode ? styles.darkText : styles.lightText]}>
                Tên dự án: {item.projectName}
              </Text>
              <Text style={[styles.projectCreator, isDarkMode ? styles.darkText : styles.lightText]}>
                Người khởi tạo: {item.creator}
              </Text>
            </TouchableOpacity>
          )}
        />

      </View>

      <Footer navigation={navigation} />
      {isLoading && <FullScreenLoader />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightContainer: {
    backgroundColor: '#F9FAFB',
  },
  darkContainer: {
    backgroundColor: '#2D2D2D',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  lightText: {
    color: '#2563EB',
  },
  darkText: {
    color: '#FFFFFF',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 20,
    fontSize: 16,
    color: '#FFFFFF',
  },
  darkInput: {
    backgroundColor: '#444',
    color: '#FFFFFF',
    borderColor: '#777',
  },
  lightInput: {
    backgroundColor: '#FFFFFF',
    color: '#1E3A8A',
  },
  projectItem: {
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  darkItem: {
    backgroundColor: 'rgba(6, 48, 124, 0.48)',
    borderColor: '#555',
  },
  lightItem: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  projectId: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  projectName:{fontSize: 19,fontWeight: 'bold',},
  projectCreator: {
    fontSize: 15,
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
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 80, 
  },
});

export default TaskProject;
