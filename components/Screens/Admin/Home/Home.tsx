import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { useNavigation } from '@react-navigation/native';
import Footer from '../../../Footer/FooterAdmin';
import { Icon } from '@ui-kitten/components';
import moment from 'moment';
import { setProject } from '../../../../redux/slide/projectslide';
import { getAllProjects } from "../../../../Service/ProjectService";
import { ProjectModal } from '@/Modal/ProjectModal';
import { ThemeContext } from '../../../../hooks/theme';
import PieChartExample from '../../Victoryby/Victoryby';
const FullScreenLoader = () => (
  <View style={styles.loadingOverlay}>
    <ActivityIndicator size="large" color="#fff" />
    <Text style={styles.loadingText}>Đang xử lý...</Text>
  </View>
);

const Home = () => {
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.user.user);
  const [projects, setProjects] = useState<ProjectModal[]>([]);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useContext(ThemeContext);

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
    project.projectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProjectStatus = (startDate: string, endDate: string) => {
    const today = moment();
    const start = moment(startDate, 'DD/MM/YYYY');
    const end = moment(endDate, 'DD/MM/YYYY');
    const daysUntilEnd = end.diff(today, 'days');
    const daysSinceStart = today.diff(start, 'days');

    if (end.isBefore(today, 'day')) return 'ended'; // Dự án đã kết thúc
    if (daysUntilEnd <= 2 && daysUntilEnd >= 0) return 'endingSoon'; // Sắp kết thúc
    if (daysSinceStart <= 2 && daysSinceStart >= 0) return 'justStarted'; // Mới bắt đầu
    return 'inProgress'; // Đang diễn ra
  };

  const renderProject = ({ item }: { item: any }) => {
    const status = getProjectStatus(item.startDate, item.endDate);

    let statusColor = '#2196F3';
    let statusText = 'Đang thực hiện';
    let statusBackgroundColor = '#e3f2fd';

    if (status === 'ended') {
      statusColor = '#9E9E9E';
      statusText = 'Đã kết thúc';
      statusBackgroundColor = '#eeeeee';
    } else if (status === 'endingSoon') {
      statusColor = '#FF9800';
      statusText = 'Sắp kết thúc';
      statusBackgroundColor = '#fff3e0';
    } else if (status === 'justStarted') {
      statusColor = '#4CAF50';
      statusText = 'Mới triển khai';
      statusBackgroundColor = '#e8f5e9';
    }

    return (
      <View style={[styles.projectInfo, { backgroundColor: statusBackgroundColor }]}>
        <View style={{ flexDirection: 'row' }}>
          <View style={[styles.statusBar, { backgroundColor: statusColor }]} />
          <View style={styles.projectContent}>
            <View style={styles.projectDetailsContainer}>
              <Text style={styles.projectCode}>Mã Dự Án: {item.projectId}</Text>
              <Text style={styles.projectName}>{item.projectName}</Text>
              <Text style={styles.projectDetails}>{item.startDate} - {item.endDate}</Text>
              <Text style={styles.projectCreator}>Người Tạo: {"\n"}{item.creator}</Text>
              <Text style={[styles.statusText, { color: statusColor }]}>● {statusText}</Text>
            </View>
            <View style={styles.projectImageContainer}>
              <Image source={{ uri: item.projectImage }} style={styles.projectImage} />
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => {
                  dispatch(setProject(item));
                  navigation.navigate('ProjectDetails');
                }}
              >
                <Text style={styles.detailsButtonText}>Xem chi tiết</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const handleAddProject = () => {
    navigation.navigate('AddProjectScreen');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#121212' : '#e0f7fa' }]}>
      <View style={[styles.searchContainer, { backgroundColor: theme === 'dark' ? '#333' : '#fff' }]}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: theme === 'dark' ? '#444' : '#f5f5f5' }]}
          placeholder="Tìm kiếm dự án..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor={theme === 'dark' ? '#ccc' : '#888'}
        />
        <Icon name="search" style={styles.searchIcon} width={20} height={20} fill={theme === 'dark' ? '#fff' : '#888'} />
      </View>

      <View style={[styles.titleContainer, { backgroundColor: theme === 'dark' ? '#333' : '#fff' }]}>
        <Text style={[styles.titleLeft, { color: theme === 'dark' ? '#fff' : '#333' }]}>Dự án</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ProjectDetails')}>
          <Text style={[styles.titleRight, { color: theme === 'dark' ? '#FF5733' : '#FF5733' }]}>Xem thêm</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddProject}>
        <Text style={styles.addButtonText}>+ Thêm Dự Án</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredProjects}
        renderItem={renderProject}
        keyExtractor={(item) => item.projectId.toString()}
        contentContainerStyle={styles.flatListContainer}
        ListEmptyComponent={
          <Text style={[{ textAlign: 'center', marginTop: 20, color: theme === 'dark' ? '#ccc' : '#999' }]}>
            Không tìm thấy dự án nào.
          </Text>
        }
      />

      <Footer navigation={navigation} />
      {isLoading && <FullScreenLoader />}
    </View>
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
    padding: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  searchInput: {
    height: 40,
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  searchIcon: {
    marginLeft: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  titleLeft: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  titleRight: {
    fontStyle: 'italic',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    marginHorizontal: 16,
    marginVertical: 10,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  flatListContainer: {
    paddingBottom: 80,
  },
  projectInfo: {
    marginTop: 4,
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  statusBar: {
    width: 8,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  projectContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
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
  projectCreator: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    paddingHorizontal: 10,
    borderLeftWidth: 3,
    borderColor: '#FF5733',
    paddingLeft: 10,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  detailsButton: {
    marginLeft: 10,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#FF5733',
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  detailsButtonText: {
    fontSize: 14,
    color: '#fff',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 6,
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

export default Home;
