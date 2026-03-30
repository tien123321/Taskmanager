import React, { useState, useContext } from 'react';
import { Modal, View, TextInput, StyleSheet, Text, TouchableOpacity,ActivityIndicator, } from 'react-native';
import { ThemeContext } from '../../../../hooks/theme';
import { updateTask } from '@/Service/TaskService';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { setTask } from '@/redux/slide/Taskslide';
const FullScreenLoader = () => (
  <View style={styles.loadingOverlay}>
    <ActivityIndicator size="large" color="#fff" />
    <Text style={styles.loadingText}>Đang xử lý...</Text>
  </View>
);
const EditTaskModal = ({ visible, onClose, onSave, title }: any) => {
  const task = useSelector((state: RootState) => state.task.task); // Lấy task từ Redux
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';
  const [dueDate, setDueDate] = useState(task?.dueDate);
  const [description, setDescription] = useState(task?.description);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true)
    if (!task) {
      alert('Không tìm thấy task để cập nhật!');
      return;
    }
  
    if (!dueDate || !description) {
      alert('Hạn chót và mô tả không được để trống!');
      return;
    }
  
    const updatedTask = { ...task, dueDate, description };
    await updateTask(task.taskId, updatedTask);
    dispatch(setTask(updatedTask));
    onSave({ dueDate, description });
    setIsLoading(false)
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.4)' }]}>
        <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#2E3A59' : '#fff' }]}>
          <Text style={[styles.modalTitle, { color: isDarkMode ? '#fff' : '#2E3A59' }]}>{title || 'Chỉnh sửa Task'}</Text>

          <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#2E3A59' }]}>Hạn chót:</Text>
          <TextInput
            style={[styles.input, { backgroundColor: isDarkMode ? '#333' : '#f1f9fb', color: isDarkMode ? '#fff' : '#000' }]}
            value={dueDate}
            onChangeText={setDueDate}
            placeholder="Nhập hạn chót (DD/MM/yyyy)"
            placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
          />

          <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#2E3A59' }]}>Mô tả:</Text>
          <TextInput
            style={[styles.input, { backgroundColor: isDarkMode ? '#333' : '#f1f9fb', color: isDarkMode ? '#fff' : '#000' }]}
            value={description}
            onChangeText={setDescription}
            placeholder="Nhập mô tả"
            multiline
            numberOfLines={4}
            placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#FF6347' }]} onPress={onClose}>
              <Text style={[styles.buttonText, { color: isDarkMode ? '#fff' : '#fff' }]}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#3366FF' }]} onPress={handleSave}>
              <Text style={[styles.buttonText, { color: isDarkMode ? '#fff' : '#fff' }]}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {isLoading && <FullScreenLoader />}
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '48%',
    elevation: 3, // for Android shadow effect
    shadowColor: '#000', // for iOS shadow effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
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
});

export default EditTaskModal;
