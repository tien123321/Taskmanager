import React, { useState, useContext, useEffect } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../../../../hooks/theme';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { deleteTask } from '@/Service/TaskService';
import { clearTask } from '@/redux/slide/Taskslide';
import { useNavigation } from '@react-navigation/native';

const DeleteTaskModal = ({ visible, onClose, onDelete }: any) => {
  const { theme } = useContext(ThemeContext);
   const navigation = useNavigation();
  const dispatch = useDispatch();
  const task = useSelector((state: RootState) => state.task.task);
  const [reason, setReason] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const isDarkMode = theme === 'dark';

  const handleDelete = async () => {
    if (!task || reason.trim() === '') return;
    try {
      setIsDeleting(true);
      await deleteTask(task.taskId);
      dispatch(clearTask());
      onDelete(reason.trim());
      setReason('');
      navigation.navigate("TaskList")
      onClose();
    } catch (error) {
      console.error('Lỗi khi xóa task:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (!visible) {
      setReason('');
      setIsDeleting(false);
    }
  }, [visible]);

  if (!task) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)' }]}>
        <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#2E3A59' : '#fff' }]}>
          <Text style={[styles.modalTitle, { color: isDarkMode ? '#fff' : '#2E3A59' }]}>
            Bạn có chắc chắn muốn xóa task này?
          </Text>

          <Text style={[styles.taskTitle, { color: isDarkMode ? '#bbb' : '#555' }]}>
            Task đưa lên bàn xóa {task?.taskName}
          </Text>

          <TextInput
            style={[styles.input, {
              backgroundColor: isDarkMode ? '#333' : '#f1f9fb',
              color: isDarkMode ? '#fff' : '#000'
            }]}
            value={reason}
            onChangeText={setReason}
            placeholder="Nhập lý do xóa..."
            placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
            multiline
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#ccc' }]}
              onPress={onClose}
              disabled={isDeleting}
            >
              <Text style={[styles.buttonText, { color: '#333' }]}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: reason.trim() && !isDeleting ? '#FF3B30' : '#999'
                }
              ]}
              onPress={handleDelete}
              disabled={!reason.trim() || isDeleting}
            >
              <Text style={styles.buttonText}>
                {isDeleting ? 'Đang xóa...' : 'Xóa'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  taskTitle: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DeleteTaskModal;
