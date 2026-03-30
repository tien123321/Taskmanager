import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Layout, Text, Button } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../../../hooks/theme';
import EditTaskModal from './UpdateTask'; // Import modal chỉnh sửa task
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { setTask } from '../../../../redux/slide/Taskslide'; // Import action cập nhật task
import { updateTask } from '@/Service/TaskService';
import DeleteTaskModal from './DeleteTask';

const FullScreenLoader = () => (
  <View style={styles.loadingOverlay}>
    <ActivityIndicator size="large" color="#fff" />
    <Text style={styles.loadingText}>Đang xử lý...</Text>
  </View>
);

const TaskDetail = () => {
  const dispatch = useDispatch();
  const task = useSelector((state: RootState) => state.task.task); // Lấy task từ Redux
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';
  const textColor = { color: isDarkMode ? '#fff' : '#2E3A59' };
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setisDeleteModalVisible] = useState(false);

  const handleDeleteTask = () => {
    setisDeleteModalVisible(true)
  };

  const renderRow = (label: string, value: string | boolean) => (
    <View style={styles.textBox}>
      <Text style={[styles.text, textColor]}>
        {label}: <Text style={styles.bold}>{String(value)}</Text>
      </Text>
    </View>
  );

  // Hàm chỉnh sửa task
  const handleEditTask = (newData: { dueDate: string; description: string }) => {
    setIsModalVisible(true)
    if (task) {
      const updatedTask = {
        ...task,
        dueDate: newData.dueDate,
        description: newData.description,
      };
      dispatch(setTask(updatedTask)); // Cập nhật lại task trong Redux
    }
  };

  return (
    <Layout style={[styles.layout, { backgroundColor: isDarkMode ? '#121212' : '#f1f9fb' }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backText, textColor]}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={[styles.title, textColor]}>Chi tiết Task</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {task && (
          <>
            {renderRow('ID Dự án', task.ProjectId)}
            {renderRow('ID Task', task.taskId)}
            {renderRow('Tên Task', task.taskName)}
            {renderRow('Người thực hiện', task.assignee)}
            {renderRow('Ngày tạo', task.createdAt)}
            {renderRow('Hạn chót', task.dueDate)}
            {renderRow('Mức độ ưu tiên', task.priority)}
            {renderRow('Đã hoàn thành', task.isCompleted ? '✅ Có' : '❌ Chưa')}

            {/* Dòng có nút "Đã kiểm tra" */}
            <View style={[styles.textBox, styles.rowBetween]}>
              <Text style={[styles.text, textColor]}>
                Đã kiểm tra: <Text style={styles.bold}>{task.isCheck ? '✅ Có' : '❌ Chưa'}</Text>
              </Text>
              <Button
                size="small"
                style={styles.checkButton}
                onPress={ async () => {
                    setIsLoading(true)
                  const updatedTask = { ...task, isCheck: !task.isCheck }; // Sử dụng isCheck thay vì isChecked
                  await updateTask(task.taskId,updatedTask)
                  dispatch(setTask(updatedTask)); // Cập nhật trạng thái "Đã kiểm tra"
                  setIsLoading(false)
                }}
              >
                {task.isCheck ? 'Kiểm tra lại' : 'Đã kiểm tra'}
              </Button>
            </View>

            <View style={styles.textBox}>
              <Text style={[styles.text, textColor]}>Mô tả:</Text>
              <Text style={[styles.text, styles.textdes, textColor, { backgroundColor: isDarkMode ? '#121212' : '#f1f9fb' }]}>
                {task.description}
              </Text>
            </View>

            <View style={styles.buttonRow}>
              <Button
                style={[styles.actionButton, { backgroundColor: '#3366FF' }]}
                onPress={() => setIsModalVisible(true)} // Hiển thị modal chỉnh sửa
              >
                Chỉnh sửa
              </Button>
              <Button
                style={[styles.actionButton, { backgroundColor: 'red', marginLeft: 10 }]}
                onPress={handleDeleteTask}
              >
                Xóa
              </Button>
            </View>
          </>
        )}
      </ScrollView>

      {/* Modal chỉnh sửa task */}
      <EditTaskModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleEditTask}
        task={task} // Pass task to modal for editing
      />
        <DeleteTaskModal
        visible={isDeleteModalVisible}
        onClose={() => setisDeleteModalVisible(false)}
        onDelete={handleDeleteTask}
        />

      {isLoading && <FullScreenLoader />}
    </Layout>
  );
};

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    width: '100%',
  },
  header: {
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: -20,
  },
  container: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  textBox: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
  },
  textdes: {
    marginTop: 8,
    lineHeight: 22,
  },
  bold: {
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingText: {
    marginTop: 12,
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkButton: {
    height: 36,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#00C896',
  },
});

export default TaskDetail;
