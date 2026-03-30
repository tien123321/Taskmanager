import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { ThemeContext } from '../../../../hooks/theme';

interface EditStoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (newStory: string) => void;
  initialStory: string;
}

const EditStoryModal: React.FC<EditStoryModalProps> = ({
  visible,
  onClose,
  onSave,
  initialStory,
}) => {
  const [editedStory, setEditedStory] = useState(initialStory);
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    setEditedStory(initialStory);
  }, [initialStory]);

  const handleSave = () => {
    if (editedStory) {
      onSave(editedStory);
    } else {
      alert('Vui lòng chọn chức vụ.');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: isDarkMode ? '#2E3A59' : '#fff',
              shadowColor: isDarkMode ? '#000' : '#999',
            },
          ]}
        >
          <Text
            style={[
              styles.modalTitle,
              { color: isDarkMode ? '#fff' : '#333' },
            ]}
          >
            Chỉnh sửa chức vụ
          </Text>

          <RNPickerSelect
            style={pickerSelectStyles(isDarkMode)}
            onValueChange={(value) => setEditedStory(value)}
            value={editedStory}
            items={[
              { label: 'Thực tập sinh', value: 'Thực tập sinh' },
              { label: 'Nhân viên', value: 'Nhân viên' },
              { label: 'Quản lý', value: 'Quản lý' },
              { label: 'Leader', value: 'Leader' },
            ]}
            placeholder={{ label: 'Chọn chức vụ', value: null }}
          />

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isDarkMode ? '#5A9' : '#4CAF50' },
            ]}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>Lưu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.cancelButton,
              { backgroundColor: isDarkMode ? '#B00020' : '#f44336' },
            ]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Hủy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '85%',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    padding: 12,
    width: '100%',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'center',
  },
  cancelButton: {},
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// Dynamic style function for picker
const pickerSelectStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    inputAndroid: {
      backgroundColor: isDarkMode ? '#3B486B' : '#f0f0f0',
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 8,
      fontSize: 16,
      color: isDarkMode ? '#fff' : '#333',
      width: '100%',
      marginBottom: 20,
    },
    inputIOS: {
      backgroundColor: isDarkMode ? '#3B486B' : '#f0f0f0',
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 8,
      fontSize: 16,
      color: isDarkMode ? '#fff' : '#333',
      width: '100%',
      marginBottom: 20,
    },
    placeholder: {
      color: isDarkMode ? '#ccc' : '#999',
    },
  });

export default EditStoryModal;
