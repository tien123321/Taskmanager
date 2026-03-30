import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  LogBox,
  ActivityIndicator,
} from 'react-native';
import {
  useTheme,
  Select,
  SelectItem,
  IndexPath,
  RadioGroup,
  Radio,
} from '@ui-kitten/components';
import { TaskModal } from '@/Modal/TaskModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getAllUsers } from '@/Service/UserService';
import { addTask } from '@/Service/TaskService';
import { useNavigation } from '@react-navigation/native';

// Ẩn cảnh báo từ thư viện UI Kitten nếu cần
if (Platform.OS === 'android' || Platform.OS === 'ios') {
  LogBox.ignoreLogs([
    'Warning: MeasureElement: Support for defaultProps',
  ]);
}

const FullScreenLoader = () => (
  <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 999,}}>
    <ActivityIndicator size="large" color="#fff" />
    <Text style={{marginTop: 12, color: '#fff', fontSize: 16}}>Đang xử lý...</Text>
  </View>
);
interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (task: TaskModal) => void;
}

const priorityOptions = ['Low', 'Medium', 'High'];

const AddTaskModal: React.FC<AddTaskModalProps> = ({ visible, onClose, onSave }) => {
    const navigation = useNavigation();
  const ProjectListtask = useSelector((state: RootState) => state.project.project);
  const theme = useTheme();
  const [taskName, setTaskName] = useState('');
  const [selectedUserIndex, setSelectedUserIndex] = useState<IndexPath>(new IndexPath(0));
  const [priorityIndex, setPriorityIndex] = useState(0);
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [userNames, setUserNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userslist = await getAllUsers();  // Lấy danh sách người dùng từ Firebase
        const userNames: string[] = userslist.map(user => user.name);  // Trích xuất tên người dùng

        // Thêm tên người dùng vào mảng userNames
        setUserNames(prevNames => [...prevNames, ...userNames]);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();  // Gọi hàm async bên trong useEffect
  }, []); 
  const handleSave = async () => {
    setIsLoading(true); // Bắt đầu loading
    const newTask: TaskModal = {
      ProjectId: ProjectListtask?.projectId || "", // Lấy projectId từ Redux state
      taskId: "Hellp", // Bạn có thể thay đổi cách tạo taskId hoặc để Firebase tự tạo
      taskName,
      assignee: userNames[selectedUserIndex.row],
      createdAt: new Date().toISOString(),
      dueDate,
      priority: priorityOptions[priorityIndex],
      description,
      isCompleted: false,
      isCheck: false,
    };
  
    try {
      // Đẩy dữ liệu lên
      await addTask(newTask); // Giả sử addTask là một API call hoặc hàm đẩy dữ liệu lên Firebase
      console.log(newTask); // Kiểm tra dữ liệu đã đẩy lên thành công
  
      // Gọi onSave sau khi dữ liệu đã được lưu
      onSave(newTask);
    } catch (error) {
      console.error('Lỗi khi lưu task:', error);
    } finally {
      // Kết thúc loading và đóng modal sau khi lưu xong
      onClose()
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent>
      <View style={styles(theme).modalContainer}>
        <View style={styles(theme).modalContent}>
          <Text style={styles(theme).modalTitle}>Thêm Task</Text>

          <View style={styles(theme).inputContainer}>
            <Text style={styles(theme).label}>Tên Task</Text>
            <TextInput
              placeholder="Tên task"
              placeholderTextColor={theme['text-hint-color']}
              style={styles(theme).input}
              value={taskName}
              onChangeText={setTaskName}
            />
          </View>

          <View style={styles(theme).inputContainer}>
            <Text style={styles(theme).label}>Người thực hiện</Text>
            <Select
              selectedIndex={selectedUserIndex}
              onSelect={index => setSelectedUserIndex(index as IndexPath)}
              value={userNames[selectedUserIndex.row]}
            >
              {userNames.map((user, index) => (
                <SelectItem title={user} key={index} />
              ))}
            </Select>
          </View>

          <View style={styles(theme).inputContainer}>
            <Text style={styles(theme).label}>Ngày kết thúc</Text>
            <TextInput
              placeholder="DD/MM/YYYY"
              placeholderTextColor={theme['text-hint-color']}
              style={styles(theme).input}
              value={dueDate}
              onChangeText={setDueDate}
            />
          </View>

          <View style={styles(theme).inputContainer}>
            <Text style={styles(theme).label}>Mức độ ưu tiên</Text>
            <RadioGroup
              selectedIndex={priorityIndex}
              onChange={index => setPriorityIndex(index)}
            >
              {priorityOptions.map((option, index) => (
                <Radio key={index} style={{ marginVertical: 4 }}>
                  {option}
                </Radio>
              ))}
            </RadioGroup>
          </View>

          <View style={styles(theme).inputContainer}>
            <Text style={styles(theme).label}>Mô tả</Text>
            <TextInput
              placeholder="Mô tả"
              placeholderTextColor={theme['text-hint-color']}
              style={[styles(theme).input, { height: 100 }]}
              value={description}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              onChangeText={setDescription}
            />
          </View>

          <View style={styles(theme).buttonContainer}>
            <TouchableOpacity onPress={handleSave} style={styles(theme).button}>
              <Text style={styles(theme).buttonText}>Lưu</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles(theme).buttonCancel}>
              <Text style={styles(theme).buttonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {isLoading && <FullScreenLoader />}
    </Modal>
  );
};
const styles = (theme: any) =>
  StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      backgroundColor: theme['background-basic-color-1'],
      padding: 20,
      borderRadius: 20,
      width: '90%',
      maxWidth: 400,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: theme['text-basic-color'],
      marginBottom: 20,
      textAlign: 'center',
      letterSpacing: 1.5,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      color: theme['text-basic-color'],
      fontWeight: '600',
      marginBottom: 8,
    },
    input: {
      height: 50,
      borderColor: theme['text-basic-color'],
      borderWidth: 1.5,
      borderRadius: 12,
      paddingHorizontal: 15,
      fontSize: 16,
      color: theme['text-basic-color'],
      backgroundColor: theme['background-basic-color-2'],
      marginTop: 5,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 25,
    },
    button: {
      backgroundColor: theme['color-primary-500'],
      paddingVertical: 14,
      paddingHorizontal: 28,
      borderRadius: 12,
      width: '48%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonCancel: {
      backgroundColor: theme['color-basic-600'],
      paddingVertical: 14,
      paddingHorizontal: 28,
      borderRadius: 12,
      width: '48%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      color: theme['text-control-color'],
      fontWeight: 'bold',
      fontSize: 16,
      textAlign: 'center',
    },
    
  });

export default AddTaskModal;
