import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Alert,ActivityIndicator } from 'react-native';
import { Icon, Button, useTheme, Layout } from '@ui-kitten/components';
import Footer from '../../../Footer/Footer';
import { useNavigation } from '@react-navigation/native';
import { fetchTaskById, getAllTasksByUserIdGroupedByProject, updateTask } from '@/Service/TaskService';
import { TaskModal } from '@/Modal/TaskModal';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

interface Project {
  id: string;
  name: string;
  creator: string;
  TIme: string;
  tasks: TaskModal[];
}
const FullScreenLoader = () => (
  <View style={styles.loadingOverlay}>
    <ActivityIndicator size="large" color="#fff" />
    <Text style={styles.loadingText}>Đang xử lý...</Text>
  </View>
);

const MyTask = () => {
  const theme = useTheme(); // Sử dụng theme của UI Kitten
  const user = useSelector((state: RootState) => state.user.user);
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isExtensionRequested,setisExtensionRequested]=useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [extensionReason, setExtensionReason] = useState('');
  const [extensionInputVisible, setExtensionInputVisible] = useState<{ [key: string]: boolean }>({});
  const [tasks, setTasks] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [Taskupdate, setTaskupdate] = useState<TaskModal>();

  const filteredTasks = tasks.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isTaskOverdue = (dueDate: string) => {
    // Chuyển định dạng từ '21/04/2025' => '2025-04-21'
    const [day, month, year] = dueDate.split('/');
    const formattedDate = `${year}-${month}-${day}`;
  
    const today = new Date();
    const dueDateObj = new Date(formattedDate);
  
    // So sánh loại bỏ giờ phút giây để chính xác hơn
    today.setHours(0, 0, 0, 0);
    dueDateObj.setHours(0, 0, 0, 0);
  
    return dueDateObj < today;
  };
  useEffect(() => {
      const fetchProjects = async () => {
        try {
          const Task = await getAllTasksByUserIdGroupedByProject(user?.name||"");
          setTasks(Task)
        } catch (error) {
          console.error('Lỗi khi lấy danh sách dự án:', error);
        } finally {
         
        }
      };
  
      fetchProjects();
      setIsLoading(false)
    }, []);
  const toggleTaskCompletion = async (taskId: string, projectId: string) => {
    setIsLoading(true)
    const updatedProjects = tasks.map(project =>
      project.id === projectId
        ? {
            ...project,
            tasks: project.tasks.map(task =>
              task.taskId === taskId
                ? { ...task, isCompleted: !task.isCompleted }
                : task
            )
          }
        : project
    );
    setTasks(updatedProjects);
    const Taskup= await fetchTaskById(taskId)
    if (Taskup?.isCompleted==true) {
      Taskup.isCompleted = false;
      setTaskupdate(Taskup)
      await updateTask(taskId,Taskup)
    }
    else if(Taskup?.isCompleted==false){
      Taskup.isCompleted = true;
      setTaskupdate(Taskup)
      await updateTask(taskId,Taskup)
    }
    console.log(Taskupdate)
    if(Taskupdate){
    }
    setIsLoading(false)
    //alert("nhớ phải thông báo")
  };

  const requestExtension = (taskId: string, projectId: string) => {
    setisExtensionRequested(true)
    alert("nhớ phải thông báo")
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'High':
        return {
          borderLeftWidth: 8,
          borderLeftColor: theme['color-danger-500'],  // Màu đỏ cho High Priority
          backgroundColor: theme['color-danger-100'], // Màu nền sáng cho High Priority
        };
      case 'Medium':
        return {
          borderLeftWidth: 8,
          borderLeftColor: theme['color-warning-500'],  // Màu cam cho Medium Priority
          backgroundColor: theme['color-warning-100'], // Màu nền sáng cho Medium Priority
        };
      case 'Low':
        return {
          borderLeftWidth: 8,
          borderLeftColor: theme['color-success-500'],  // Màu xanh cho Low Priority
          backgroundColor: theme['color-success-100'], // Màu nền sáng cho Low Priority
        };
      default:
        return {};
    }
  };

  const renderTaskDetails = (projectId: string) => {
    const project = tasks.find(task => task.id === projectId);
    if (project) {
      return (
        <View style={[styles.taskDetailsContainer,]}>
          {project.tasks.map(task => (
            <TouchableOpacity
              key={task.taskId}
              style={[styles.taskItem, getPriorityStyle(task.priority),{ backgroundColor: theme['background-basic-color-2'],
                 borderTopColor: '#ccc',borderTopWidth:1,
                 borderRightColor: '#ccc',borderRightWidth:1,
                 borderBottomColor:'#ccc',borderBottomWidth:1, }]}
              onPress={() => {
                Alert.alert('Bạn đang ở task:', task.taskName);
              }}
            >
              <Text style={[styles.taskDetailText,{ color: theme['text-basic-color'] }]}>
                <Text style={[styles.boldText,{ color: theme['text-basic-color'] }]}>Mã Task:</Text> {task.taskId}
              </Text>
              <Text style={[styles.taskDetailText,{ color: theme['text-basic-color'] }]}>
                <Text style={[styles.boldText,{ color: theme['text-basic-color'] }]}>Tên Task:</Text> {task.taskName}
              </Text>
              <Text style={[styles.taskDetailText,{ color: theme['text-basic-color'] }]}>
                <Text style={[styles.boldText,{ color: theme['text-basic-color'] }]}>Ngày tạo:</Text> {task.createdAt}
              </Text>
              <Text style={[styles.taskDetailText,{ color: theme['text-basic-color'] }]}>
                <Text style={[styles.boldText,{ color: theme['text-basic-color'] }]}>Hạn hoàn thành:</Text> {task.dueDate}
              </Text>
              <Text style={[styles.taskDetailText,{ color: theme['text-basic-color'] }]}>
                <Text style={[styles.boldText,{ color: theme['text-basic-color'] }]}>Độ ưu tiên:</Text> {task.priority}
              </Text>
              <Text style={[styles.taskDetailText,{ color: theme['text-basic-color'] }]}>
                <Text style={[styles.boldText,{ color: theme['text-basic-color'] }]}>Tóm tắt:</Text> {task.description}
              </Text>
              <Text style={[styles.taskDetailText,{ color: theme['text-basic-color'] }]}>
                <Text style={[styles.boldText,{ color: theme['text-basic-color'] }]}>Trạng thái:</Text> {task.isCompleted ? 'Hoàn thiện' : 'Chưa hoàn thiện'}
              </Text>

              { 
              isTaskOverdue(task.dueDate) && !task.isCompleted ? (
                <Text style={styles.overdueText}>Đã quá hạn</Text>
              ) : task.isCompleted && task.isCheck ? (
                <Text style={styles.completedText}>Đã hoàn thành</Text>
              ) : (
                <TouchableOpacity
                  onPress={() => toggleTaskCompletion(task.taskId, projectId)}
                  style={styles.toggleCompletionButton}
                >
                  <Text style={styles.toggleCompletionButtonText}>
                    {task.isCompleted ? 'Đánh dấu chưa hoàn thiện' : 'Đánh dấu hoàn thiện'}
                  </Text>
                </TouchableOpacity>
              )}

              {/* Yêu cầu gia hạn */}
              {isTaskOverdue(task.dueDate) && !task.isCompleted && !task.isCheck ? (
                isExtensionRequested ? (
                  <Text style={styles.extensionRequestedText}>Đã yêu cầu gia hạn</Text>
                ) : extensionInputVisible[task.taskId] ? (
                  <View>
                    <TextInput
                      style={[styles.extensionReasonInput,{ color: theme['text-basic-color'], backgroundColor: theme['background-basic-color-2'] }]}
                      placeholder="Nhập lý do yêu cầu gia hạn..."
                      placeholderTextColor={theme['text-hint-color']}
                      value={extensionReason}
                      onChangeText={setExtensionReason}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        requestExtension(task.taskId, projectId);
                        setExtensionInputVisible(prev => ({ ...prev, [task.taskId]: false }));
                        setExtensionReason('');
                      }}
                      style={styles.sendExtensionButton}
                    >
                      <Text style={styles.sendExtensionButtonText}>Gửi yêu cầu</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() =>
                      setExtensionInputVisible(prev => ({ ...prev, [task.taskId]: true }))
                    }
                    style={styles.requestExtensionButton}
                  >
                    <Text style={styles.requestExtensionButtonText}>Yêu cầu gia hạn</Text>
                  </TouchableOpacity>
                )
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
      );
    }
  };

  return (
    <Layout style={{ height: '100%',width:"100%" }}>
      <View style={[styles.container, { backgroundColor: theme['background-basic-color-1'] }]}>
        <View style={[styles.searchContainer ,{ backgroundColor: theme['background-basic-color-1'],borderColor:"#ccc" , borderWidth: 1,}]}>
          <TextInput
            style={[styles.searchInput, { color: theme['background-basic-color-1'] }]}
            placeholder="Tìm kiếm dự án..."
            placeholderTextColor={theme['text-hint-color']}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <Icon name="search" style={styles.searchIcon} width={20} height={20} fill={theme['text-hint-color']} />
        </View>

        <FlatList
          data={filteredTasks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.projectContainer}>
              <TouchableOpacity
                style={[styles.taskItem ,{ backgroundColor: theme['background-basic-color-2'],borderColor:"#ccc" , borderWidth: 1,}]}
                onPress={() => {
                  const isSelected = selectedProjectId === item.id;
                  setSelectedProjectId(isSelected ? null : item.id);
                }}
              >
                <Text style={[styles.taskName,{ color: theme['text-basic-color'] }]}>Tện dự án: {item.name}</Text>
                <Text style={[styles.creatorName,{ color: theme['text-basic-color'] }]}>Thời hạn: {item.TIme}</Text>
                <Text style={[styles.creatorName,{ color: theme['text-basic-color'] }]}>
                  Người tạo: {item.creator}
                </Text>
              </TouchableOpacity>

              {selectedProjectId === item.id && renderTaskDetails(item.id)}
            </View>
          )}
        />

        <View style={styles.footerContainer}>
          <Footer navigation={navigation} />
        </View>
        {isLoading && <FullScreenLoader />}
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 80,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
    paddingLeft: 14,
  },
  searchIcon: {
    marginLeft: 12,
  },
  projectContainer: {
    marginBottom: 20,
  },
  taskItem: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  taskName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  creatorName: {
    fontSize: 14,
    marginTop: 5,
  },
  taskDetailsContainer: {
    marginTop: 20,
  },
  taskDetailText: {
    fontSize: 14,
    marginBottom: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  overdueText: {
    color: 'red',
    fontWeight: 'bold',
  },
  completedText: {
    color: 'green',
    fontWeight: 'bold',
  },
  toggleCompletionButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  toggleCompletionButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  requestExtensionButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FF9800',
    borderRadius: 5,
  },
  requestExtensionButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  extensionRequestedText: {
    color: '#FF5722',
    fontWeight: 'bold',
  },
  extensionReasonInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  sendExtensionButton: {
    padding: 10,
    backgroundColor: '#3F51B5',
    borderRadius: 5,
  },
  sendExtensionButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff', // Đặt màu nền mặc định sáng
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Cập nhật theme để sử dụng trong footer
  footerContainerDark: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#333333', // Màu nền tối cho chế độ dark
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  footerText: {
    fontSize: 14,
    color: '#333', // Sử dụng màu sáng cho văn bản
  },

  footerTextDark: {
    fontSize: 14,
    color: '#fff', // Sử dụng màu sáng cho văn bản khi chế độ tối
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

export default MyTask;
