import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, TextInput,ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { useNavigation } from '@react-navigation/native';
import Footer from '../../../Footer/Footer';
import { Icon, Layout, useTheme } from '@ui-kitten/components';
import ImageSlider from './ImageSlider';
import { ProjectModal } from '@/Modal/ProjectModal';
import { getAllProjects } from "../../../../Service/ProjectService";
import { setProject } from '../../../../redux/slide/projectslide';

const FullScreenLoader = () => (
  <View style={styles.loadingOverlay}>
    <ActivityIndicator size="large" color="#fff" />
    <Text style={styles.loadingText}>Đang xử lý...</Text>
  </View>
);
const DashboardScreens = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const [Projects, setProjects] = useState<ProjectModal[]>([]);
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
 

  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = Projects.filter((project) =>
    project.projectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderProject = ({ item }: { item: any }) => (
    <View style={[styles.projectInfo, { backgroundColor: theme['background-basic-color-2'], borderColor: '#ccc' }]}>
      <View style={styles.projectContent}>
        <View style={styles.projectDetailsContainer}>
          <Text style={[styles.projectCode, { color: theme['text-basic-color'] }]}>Mã Dự Án: {item.projectId}</Text>
          <Text style={[styles.projectName, { color: theme['text-basic-color'] }]}>{item.projectName}</Text>
          <Text style={[styles.projectDetails, { color: theme['text-hint-color'] }]}>{item.startDate} - {item.endDate}</Text>
          <Text style={[styles.projectCreator, { borderColor: '#FF5733', color: theme['text-basic-color'] }]}>
            Người Tạo: {"\n"}{item.creator}
          </Text>
        </View>
        <View style={styles.projectImageContainer}>
          <Image source={{ uri: item.projectImage }} style={styles.projectImage} />
          <TouchableOpacity style={styles.detailsButton} onPress={() => {
            dispatch(setProject(item))
            navigation.navigate('Projectdetailuser')}}>
            <Text style={styles.detailsButtonText}>Xem chi tiết</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <Layout style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={[styles.searchContainer, { backgroundColor: theme['background-basic-color-1'],borderColor:"#ccc" , borderWidth: 1,}]}>
          <TextInput
            style={[styles.searchInput, { color: theme['text-basic-color'], backgroundColor: theme['background-basic-color-2'] }]}
            placeholder="Tìm kiếm dự án..."
            placeholderTextColor={theme['text-hint-color']}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <Icon name="search" style={styles.searchIcon} width={20} height={20} fill={theme['text-hint-color']} />
        </View>

        <View style={styles.imageContainer}>
          <ImageSlider />
        </View>

        <View style={[styles.titleContainer, { backgroundColor: theme['background-basic-color-1'] }]}>
          <Text style={[styles.titleLeft, { color: theme['text-basic-color'] }]}>Dự án</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ProjectDetails')}>
            <Text style={styles.titleRight}>Xem thêm</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredProjects}
          renderItem={renderProject}
          keyExtractor={(item) => item.projectId}
          contentContainerStyle={styles.flatListContainer}
        />

        <Footer navigation={navigation} />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginHorizontal:12,
    marginVertical:12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    elevation: 3,
  },
  searchInput: {
    height: 40,
    flex: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  searchIcon: {
    marginLeft: 10,
  },
  imageContainer: {
    height: 200,
    width: '100%',
    overflow: 'hidden',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    elevation: 3,
  },
  titleLeft: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  titleRight: {
    fontStyle: 'italic',
    fontSize: 16,
    color: '#FF5733',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  flatListContainer: {
    paddingBottom: 80,
  },
  projectInfo: {
    marginTop: 4,
    padding: 16,
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  projectContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  projectDetailsContainer: {
    flex: 1,
    paddingRight: 16,
  },
  projectCode: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  projectName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  projectDetails: {
    fontSize: 12,
    marginBottom: 6,
  },
  projectImageContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 16,
  },
  projectImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  detailsButton: {
    marginLeft: 10,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#FF5733',
    borderRadius: 15,
    alignItems: 'center',
  },
  detailsButtonText: {
    fontSize: 14,
    color: '#fff',
  },
  projectCreator: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    paddingHorizontal: 10,
    borderLeftWidth: 3,
    paddingLeft: 10,
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

export default DashboardScreens;
