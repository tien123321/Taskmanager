import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import { Icon, Layout } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { ThemeContext } from '../../../../hooks/theme';
import * as ImagePicker from 'expo-image-picker';
import { format } from 'date-fns';
import { addProject } from '@/Service/ProjectService';

const FullScreenLoader = () => (
  <View style={styles.loadingOverlay}>
    <ActivityIndicator size="large" color="#fff" />
    <Text style={styles.loadingText}>Đang xử lý...</Text>
  </View>
);

const AddProjectScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creator, setcreator] = useState('');
  const [deadline, setDeadline] = useState('');
  const [budget, setBudget] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    switch (field) {
      case 'name': setName(value); break;
      case 'description': setDescription(value); break;
      case 'deadline': setDeadline(value); break;
      case 'budget': setBudget(value); break;
      case 'creator': setcreator(value);break;
      default: break;
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Vui lòng cấp quyền truy cập thư viện ảnh');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Cho phép crop ảnh
      aspect: [4, 3], // Tỷ lệ crop
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAddProject = async () => {
    setIsLoading(true)
    const projectadd= {
      projectId: "",
      projectName: name||"",
      projectImage: imageUri||"",
      creator:creator||"",
      description:description||"",
      startDate: format(new Date(), 'dd/MM/yyyy'),
      endDate:deadline||"",
      link: budget||"" 
    }
    await addProject(projectadd)
    navigation.navigate("HomeAd");
    setIsLoading(false)

  };

  return (
    <Layout style={[styles.layout, { backgroundColor: isDarkMode ? '#121212' : '#f9fbfd' }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back-outline" style={[styles.backIcon, { tintColor: isDarkMode ? '#fff' : '#1565c0' }]} />
          <Text style={[styles.backText, { color: isDarkMode ? '#fff' : '#1565c0' }]}>Quay về</Text>
        </TouchableOpacity>

        {/* Tiêu đề trang */}
        <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#1565c0' }]}>Thêm Dự Án Mới</Text>

        {/* Ảnh dự án */}
        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.projectImage} resizeMode="cover" />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePickerText}>Chọn ảnh dự án</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Các trường nhập liệu */}
        {[
          { label: 'Tên dự án', key: 'name', value: name },
          { label: 'Mô tả', key: 'description', value: description },
          { label: 'Hạn hoàn thành', key: 'deadline', value: deadline },
          { label: 'Người khởi tạo', key: 'creator', value: creator },
          { label: 'Link tài liệu', key: 'budget', value: budget },
        ].map((item) => (
          <View key={item.key} style={[styles.infoRow, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
            <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#455a64' }]}>{item.label}:</Text>
            <TextInput
              style={[styles.input, {
                backgroundColor: isDarkMode ? '#424242' : '#fefefe',
                color: isDarkMode ? '#fff' : '#263238',
              }]}
              value={item.value}
              onChangeText={(text) => handleChange(item.key, text)}
              placeholder={`Nhập ${item.label.toLowerCase()}`}
              multiline
              placeholderTextColor={ isDarkMode ? '#fff' : '#455a64'} 
            />
          </View>
        ))}

        {/* Nút thêm dự án */}
        <TouchableOpacity style={[styles.updateButton, { backgroundColor: '#43a047' }]} onPress={handleAddProject}>
          <Text style={styles.updateButtonText}>Thêm dự án</Text>
        </TouchableOpacity>

        {isLoading && <FullScreenLoader />}
      </ScrollView>
    </Layout>
  );
};

export default AddProjectScreen;

const styles = StyleSheet.create({
  layout: { flex: 1, width: '100%' },
  container: { width: '95%', flexGrow: 1 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  backIcon: { width: 22, height: 22, marginRight: 6 },
  backText: { fontSize: 16, fontWeight: '500' },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 14,
    textAlign: 'center',
  },
  imagePicker: {
    marginBottom: 20,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
  },
  imagePlaceholder: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  projectImage: {
    width: '100%',
    height: 200,
  },
  infoRow: {
    marginBottom: 4,
    padding: 10,
    borderRadius: 12,
  },
  label: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  updateButton: {
    marginTop: 10,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  updateButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  loadingOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 999,
  },
  loadingText: { marginTop: 12, color: '#fff', fontSize: 16 },
});
