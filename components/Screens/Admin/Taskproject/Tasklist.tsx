import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Icon, useTheme } from '@ui-kitten/components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { TaskModal } from '@/Modal/TaskModal';
import { getAllTasksByProjectId } from '@/Service/TaskService';
import AddTaskModal from './AddTask';
import { setTask } from '@/redux/slide/Taskslide';
const FullScreenLoader = () => (
  <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 999,}}>
    <ActivityIndicator size="large" color="#fff" />
    <Text style={{marginTop: 12, color: '#fff', fontSize: 16}}>Đang xử lý...</Text>
  </View>
);
const TaskListScreen = () => {
  const ProjectListtask = useSelector((state: RootState) => state.project.project);
    const [modalVisible, setModalVisible] = useState(false);
    const Dispach=useDispatch()
  const [Tasks, setTasks] = useState<TaskModal[]>([]);
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const projectName = "Thiết kế UI";
  const [searchText, setSearchText] = useState('');
   const [isLoading, setIsLoading] = useState(true);
   const fetchTasks = async (isMounted: any) => {
    if (!ProjectListtask?.projectId) return;

    try {
      const taskList = await getAllTasksByProjectId(ProjectListtask?.projectId); // Bạn có thể thay thế "64" bằng projectId của bạn
      console.log(taskList);
      if (isMounted) {
        setTasks(taskList); // Cập nhật state với danh sách task mới
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách task:', error);
    }
  };
   useEffect(() => {
    let isMounted = true; 

    fetchTasks(isMounted); // Gọi hàm để lấy dữ liệu task
    setIsLoading(false)
    return () => {
      isMounted = false;
    };
  }, [modalVisible]);
  const tasks: TaskModal[] = Tasks
  console.log(tasks)
  
  const isTaskOverdue = (dueDate: string, isCompleted: boolean) => {
    if (isCompleted) return false;
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  };

  const filteredTasks = tasks.filter(task =>
    task.taskName.toLowerCase().includes(searchText.toLowerCase()) ||
    task.description.toLowerCase().includes(searchText.toLowerCase()) ||
    task.assignee.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderTaskItem = ({ item }: { item: tasks  }) => {
    const overdue = isTaskOverdue(item.dueDate, item.isCompleted);

    let statusStyle = styles(theme).pendingBorder;
    let statusText = 'Chưa hoàn thành';

    if (item.isCompleted) {
      statusStyle = styles(theme).completedBorder;
      statusText = 'Hoàn thành';
    } else if (overdue) {
      statusStyle = styles(theme).overdueBorder;
      statusText = 'Quá hạn';
    }

    return (
      <View style={[styles(theme).taskItem, statusStyle]}>
        <Text style={styles(theme).taskTitle}>{item.taskName}</Text>
        <Text style={styles(theme).taskField}><Text style={styles(theme).fieldLabel}>Mã task:</Text> {item.taskId}</Text>
        <Text style={styles(theme).taskField}><Text style={styles(theme).fieldLabel}>Người thực hiện:</Text> {item.assignee}</Text>
        <Text style={styles(theme).taskField}><Text style={styles(theme).fieldLabel}>Ngày phân công:</Text> {item.createdAt}</Text>
        <Text style={styles(theme).taskField}><Text style={styles(theme).fieldLabel}>Ngày kết thúc:</Text> {item.dueDate}</Text>
        <Text style={styles(theme).taskField}><Text style={styles(theme).fieldLabel}>Trạng thái:</Text> {statusText}</Text>
        <TouchableOpacity onPress={ async () => {
          Dispach(setTask(item))
          navigation.navigate("TaskDetail")}}>
          <Text style={styles(theme).linkText}>Xem chi tiết</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };
  const handleEditStory =()=>{

  }
  const handleAdd=()=>{
    setIsLoading(true)
    setModalVisible(true)
    setIsLoading(false)
  }

  return (
    <View style={styles(theme).container}>
      {/* Nút quay lại */}
      <TouchableOpacity onPress={handleBack} style={styles(theme).backButton}>
        <Text style={styles(theme).backText}>← Quay lại</Text>
      </TouchableOpacity>

      {/* Tên dự án với Xem chi tiết */}
      <View style={styles(theme).projectContainer}>
        <Text style={styles(theme).projectName}>Tên dự án: {projectName}</Text>
        <TouchableOpacity onPress={() => navigation.navigate("ProjectDetails" as never)}>
          <Text style={styles(theme).viewDetailText}>Xem chi tiết dự án</Text>
        </TouchableOpacity>
      </View>

      {/* Thanh tìm kiếm */}
      <View style={styles(theme).searchContainer}>
        <Icon name="search" fill="#999" style={styles(theme).searchIcon} />
        <TextInput
          placeholder="Tìm kiếm task..."
          placeholderTextColor={theme['text-hint-color']}
          style={styles(theme).searchInput}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <TouchableOpacity onPress={handleAdd} style={styles(theme).addTaskButton}>
        <Text style={styles(theme).addTaskText}>+ Thêm task</Text>
      </TouchableOpacity>

      {/* Danh sách task */}
      <FlatList
        data={filteredTasks}
        keyExtractor={item => item.taskId}
        renderItem={renderTaskItem}
        contentContainerStyle={{ paddingBottom: 10, paddingTop: 10 }}
      />
      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleEditStory}
      />
      {isLoading && <FullScreenLoader />}
    </View>
  );
};

const styles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme['background-basic-color-1'],
      padding: 16,
    },
    backButton: {
      marginBottom: 8,
    },
    backText: {
      fontSize: 16,
      color: theme['color-primary-500'],
      fontWeight: '600',
    },
    projectContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    projectName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme['color-primary-700'],
    },
    viewDetailText: {
      fontSize: 16,
      color: theme['color-primary-500'],
      fontWeight: '500',
      textAlign: 'left',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme['background-basic-color-2'],
      paddingHorizontal: 4,
      borderRadius: 12,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme['border-basic-color-3'],
    },
    searchIcon: {
      width: 24,
      height: 24,
      tintColor: '#999',
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: theme['text-basic-color'],
    },
    addTaskButton: {
      alignSelf: 'flex-end',
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: theme['color-primary-500'],
      borderRadius: 8,
      marginBottom: 12,
    },
    addTaskText: {
      color: theme['text-control-color'],
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'right',
    },
    taskItem: {
      backgroundColor: theme['background-basic-color-2'],
      borderRadius: 16,
      padding: 16,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 3,
    },
    taskTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme['text-basic-color'],
      marginBottom: 8,
    },
    taskField: {
      fontSize: 15,
      color: theme['text-basic-color'],
      marginBottom: 4,
    },
    fieldLabel: {
      fontWeight: '600',
      color: theme['text-hint-color'],
    },
    linkText: {
      color: theme['color-primary-500'],
      fontSize: 15,
      fontWeight: '500',
      marginTop: 10,
    },
    overdueBorder: {
      borderLeftWidth: 5,
      borderLeftColor: '#E74C3C',
    },
    completedBorder: {
      borderLeftWidth: 5,
      borderLeftColor: '#3498DB',
    },
    pendingBorder: {
      borderLeftWidth: 5,
      borderLeftColor: '#F39C12',
    },
  });

export default TaskListScreen;
